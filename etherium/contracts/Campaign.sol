// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract CampaignFactory{
    address[] public deployedContracts;

    function createCampaign(uint minimumContribution) public{
        address newCampaign = address(new Campaign(minimumContribution, msg.sender));
        deployedContracts.push(newCampaign);
    }

    function getDeployedCampaign() public view returns (address[] memory){
        return deployedContracts;
    }

}

contract Campaign{
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    uint public numRequests;
    mapping (uint => Request) public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Only manager can create spend request");
        _;
    }

    constructor(uint minimum, address creator) { 
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender], "Only contributer can approve a request");
        require(!request.approvals[msg.sender], "You have already responded to this request");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public payable restricted {
        Request storage request = requests[index];
        require(!request.complete,"Request is already complete");
        require(request.approvalCount > (approversCount / 2));

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

}