'use client';
import Web3 from "web3";

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== "undefined") {
  // We are in the browser and metamask is running
  web3 = new Web3(window.ethereum);

} else {
  // We are on the server *OR* use is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2e9c7d1c1c3e4df48b3ed96057d899b2",
  );

  web3 = new Web3(provider);

}

export default web3;