'use client';
import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x14cDEeCF74186D1F72Fea77c8225929e71e74458"
);

export default instance;