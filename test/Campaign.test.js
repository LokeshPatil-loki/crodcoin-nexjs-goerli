const { fail } = require("assert");
const assert = require("assert");
const ganache = require("ganache-cli");
const { type } = require("os");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledCampaign = require("../etherium/build/Campaign.json");
const compiledFactory = require("../etherium/build/CampaignFactory.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "2000000" });

    await factory.methods.createCampaign("100").send({
      from: accounts[0],
      gas: "2000000",
    });

  [campaignAddress] = await factory.methods.getDeployedCampaign().call({from: accounts[0]});

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campagins", () => {
  it("Deploys a CampaignFactory and Campaign ", () => {
    assert.ok(factory.options.address,"CampaignFactory is not deployed");
    assert.ok(campaign.options.address, "Campaign is not deployed");
  })

  it("marks caller as campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  })

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({from: accounts[1], value: "1000"});
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  })

  it("requires minimum contribution to become contributor", async () => {
    try {
      await campaign.methods.contribute().send({from: accounts[1], value: "90"});
      throw new Error("This should not run");
    } catch (error) {
      assert.notEqual(error.message, "This should not run")
    }
  })

  it("allows manager to make a payment request", async () => {
    await campaign.methods.contribute().send({from: accounts[1], value: "1000"});
    let requestIndex = await campaign.methods.numRequests().call();
    await campaign.methods.createRequest("Buy a house", "500",accounts[3]).send({from: accounts[0], gas:"1000000"});
    const request = await campaign.methods.requests(requestIndex).call();
    assert.equal("Buy a house", request.description);
  })

  it("processes request", async () => {
    await campaign.methods.contribute().send({from: accounts[1], value: web3.utils.toWei("10", 'ether')});
    await campaign.methods.contribute().send({from: accounts[2], value: web3.utils.toWei("10", 'ether')});
    await campaign.methods.contribute().send({from: accounts[3], value: web3.utils.toWei("10", 'ether')});

    const numberOfContributors = await campaign.methods.approversCount().call();
    assert.equal(3, numberOfContributors,"Number of attributors is not right");
    let requestIndex = await campaign.methods.numRequests().call();
    await campaign.methods.createRequest("A", web3.utils.toWei("5", 'ether'),accounts[4]).send({from: accounts[0], gas:"1000000"});

    await campaign.methods.approveRequest(requestIndex).send({from: accounts[1], gas: "1000000"});
    await campaign.methods.approveRequest(requestIndex).send({from: accounts[2], gas: "1000000"});

    let request = await campaign.methods.requests(requestIndex).call();
    assert.equal(false, request.complete, `request.complete`);
    assert.equal(2, request.approvalCount, `request approval count is not correct`);


    await campaign.methods.finalizeRequest(requestIndex).send({from: accounts[0], gas: "1000000"});
    request = await campaign.methods.requests(requestIndex).call();
    assert.equal(request.complete,true, `request.complete`);

    let balance = await web3.eth.getBalance(accounts[4]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    
    assert(balance > 104);
  })
})
