# Solidity Contract with Royalties

This repository demonstrates how to build, test, and deploy a Solidity smart contract with NFT minting and royalty functionality. The `CreatorNFT` contract follows the ERC-721 standard and includes support for EIP-2981, enabling creators to earn royalties when their NFTs are sold.

## OpenZeppelin Contracts
The `CreatorNFT` contract leverages OpenZeppelin’s battle-tested libraries:

- <strong>ERC-721</strong>: Implements the standard for non-fungible tokens.
- <strong>EIP-2981</strong>: Adds royalty support for marketplaces.
- <strong>Ownable</strong>: Provides secure ownership and access control.

You can easily extend the contract with additional OpenZeppelin functionality:
- <strong>Pausable</strong>: Pause and unpause contract functions.
- <strong>ERC721Enumerable</strong>: Enable enumeration of NFTs.

## Getting Started
Follow these steps to set up, deploy, and test the `CreatorNFT` contract.

### Prerequisites
- <strong>Node.js</strong>: Install Node.js (version 16 or later).
- <strong>npm</strong>: Ensure npm is installed with Node.js.
- <strong>Hardhat</strong>: A development environment for Ethereum.

To complete a Testnet deploy:
  - <strong>Alchemy API key</strong>: Free tier node provider, can modify easily for Infura.
  - <strong>Private key</strong>: Your wallet setup with some ETH on Sepolia, faucet info and links provided below.

## 1. Clone the Repository
```bash
git clone https://github.com/starman69/solidity-getting-started
cd solidity-getting-started
```

## 2. Install Dependencies
Install the required packages:
```bash
npm install
```

## 3. Compile the Contract
Compile the Solidity contract using Hardhat:
```bash
npx hardhat compile
```

## 4. Deploy the Contract
Hardhat's Ignition module enables structured deployment of contracts. The `CreatorNFT` deployment module is defined in `modules/CreatorNFT.ts`. The deployment logic is output and defined by chain in the `deployments/` folder.

### Deploy to Local Hardhat Network
1. Start the Hardhat local blockchain:
    ```bash
    npx hardhat node
    ```

2. Deploy the contract:
    ```bash
    npx hardhat ignition deploy ignition/modules/CreatorNFT.ts --network localhost
    ```

    Example output:
    ```bash
    Hardhat Ignition 🚀

    Deploying [ CreatorNFTModule ]

    Batch #1
      Executed CreatorNFTModule#CreatorNFT

    [ CreatorNFTModule ] successfully deployed 🚀

    Deployed Addresses

    CreatorNFTModule#CreatorNFT - 0x5FbDB2315678afecb367f032d93F642f64180aa3
    ```

3. Verify contract:
    ```bash
    npx hardhat console --network localhost

    const { ethers } = require("hardhat");
    const creatorNFT = await ethers.getContractAt("CreatorNFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
    await creatorNFT.mint();
    console.log("NFT minted successfully!");
    const owner = await creatorNFT.ownerOf(0); // Token ID 0
    console.log("Owner of Token ID 0:", owner);
    ```

### Deploy to a Testnet (Sepolia)
1. Add your wallet private key and Alchemy API key to `.env`:
    ```plaintext
    ALCHEMY_API_URL=your_alchemy_api_key
    SEPOLIA_PRIVATE_KEY=your_private_key
    ```

2. Deploy to Sepolia:
    ```bash
    npx hardhat ignition deploy ignition/modules/CreatorNFT.ts --network sepolia
    ```
    Example output:
    ```bash
    ✔ Confirm deploy to network sepolia (11155111)? … yes

    Hardhat Ignition 🚀

    Deploying [ CreatorNFTModule ]

    Batch #1
      Executed CreatorNFTModule#CreatorNFT

    [ CreatorNFTModule ] successfully deployed 🚀

    Deployed Addresses

    CreatorNFTModule#CreatorNFT - 0x590e905f20b581D683b795B4B621CB50c18d2Af0
    ```

3. Verify contract:

    View in Alchemy Dashboard and Etherscan:
    - https://sepolia.etherscan.io/address/0x590e905f20b581D683b795B4B621CB50c18d2Af0

## Run Tests
1. Generate TypeChain Types
    ```bash
    npx hardhat typechain
    ```
2. Run the provided test suite to verify the contract functionality:
    ```bash
    npx hardhat test
    ```
2. Example output:
    ```plaintext
    CreatorNFT Contract
      ✔ Should deploy and set the correct owner
      ✔ Should mint a new NFT and assign it to the owner
      ✔ Should correctly set the default royalty for minted NFTs
      ✔ Should allow the token owner to set custom royalties
      ✔ Should revert if a non-owner tries to mint an NFT
      ✔ Should revert if a non-owner tries to set royalties
      ✔ Should not allow royalties greater than 100%
      ✔ Should emit the correct events on mint and royalty updates
      
    8 passing (414ms)
    ```


## **Sepolia Testnet Faucets**

When deploying or testing on the Sepolia testnet, you’ll need Sepolia ETH to pay for gas. Most faucets have daily or hourly limits per address. 

<strong>Testnet ETH has no real-world value and is for development purposes only.</strong>

Here are some reliable faucets to obtain free Sepolia ETH:
- [Google Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
  - Get free Sepolia ETH sent directly to your wallet.
  - Brought to you by Google Cloud for Web3.

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)  
  - Requires a valid Ethereum wallet address.
  - Funded by Alchemy; reliable and easy to use.

- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)  
  - Connect your wallet to claim Sepolia ETH.
  - Requires social verification (Twitter or GitHub).

- [Paradigm Sepolia Faucet](https://faucet.paradigm.xyz/)  
  - Provides Sepolia ETH quickly.
  - Simple interface; requires wallet address.

- [Sepolia.dev Faucet](https://sepolia.dev/)  
  - Community-maintained faucet for developers.
  - Limited daily allowance per address.

## **References**

### **General Resources**
- [Ethereum Official Website](https://ethereum.org/en/)
- [Ethers.js Documentation](https://docs.ethers.org/)

### **Solidity**
- [Solidity Documentation](https://docs.soliditylang.org/en/latest/)
- [Solidity by Example](https://solidity-by-example.org/)
- [Remix IDE](https://remix.ethereum.org/)

### **Hardhat**
- [Hardhat Official Documentation](https://hardhat.org/)
- [Hardhat GitHub Repository](https://github.com/NomicFoundation/hardhat)
- [Hardhat Plugins](https://hardhat.org/plugins/)
- [Hardhat Toolbox](https://hardhat.org/hardhat-toolbox/)

### **OpenZeppelin**
- [OpenZeppelin Contracts Documentation](https://docs.openzeppelin.com/contracts)
- [OpenZeppelin GitHub Repository](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/)

### **Testnets and Deployment**
- [Alchemy API Key Setup](https://www.alchemy.com/)
- [Infura API Key Setup](https://infura.io/)
- [Sepolia Testnet](https://sepolia.dev/)
- [Goerli Testnet](https://goerli.net/)

### **Security and Best Practices**
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Defender](https://openzeppelin.com/defender/)
- [Trail of Bits Slither](https://github.com/crytic/slither)
- [MythX](https://mythx.io/)

### **NFTs and Standards**
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [EIP-2981 Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)

### **Useful Tools**
- [Chainlist (Connect Wallets to Networks)](https://chainlist.org/)
- [Etherscan (Ethereum Block Explorer)](https://etherscan.io/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Solidity Visual Auditor (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor)
- [OpenZeppelin CLI (Legacy Tool)](https://docs.openzeppelin.com/cli)
