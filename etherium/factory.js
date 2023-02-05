'use client';
import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xEc02d87204f39248FAFf1550fa4fCe4Ad1e70259"
);

export default instance;