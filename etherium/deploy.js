const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, bytecode } = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "tourist good flag pool valley faculty quarter daughter release hero rather awake",
  "https://goerli.infura.io/v3/2e9c7d1c1c3e4df48b3ed96057d899b2"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "10000000" });
  
  console.log("Contract deployed to", result.options.address);
};

deploy();
