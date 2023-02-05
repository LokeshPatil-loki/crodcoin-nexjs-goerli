const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");

let solcInput = {
  language: 'Solidity',
  sources: {
    contract: {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': [
          "abi",
          "evm.bytecode.object"
        ]
      }
    }
  }
};

solcInput = JSON.stringify(solcInput);

const compiledContracts = JSON.parse(solc.compile(solcInput)).contracts.contract;

fs.ensureDirSync(buildPath);

for (const contract in compiledContracts) {
  const abi = compiledContracts[contract].abi;
  const bytecode = compiledContracts[contract].evm.bytecode.object;
  fs.outputJSONSync(
    path.resolve(buildPath,contract+".json"),
    {abi, bytecode}
  )
}