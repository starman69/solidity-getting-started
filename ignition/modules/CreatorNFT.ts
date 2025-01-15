// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ROYALTY_PERCENTAGE = 500; // 5% royalty

const CreatorNFTModule = buildModule("CreatorNFTModule", (m) => {
  const royaltyPercentage = m.getParameter("royaltyPercentage", ROYALTY_PERCENTAGE);

  const nft = m.contract("CreatorNFT", [royaltyPercentage]);

  return { nft };
});

export default CreatorNFTModule;
