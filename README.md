# Solidity Contract with Royalties

This repository demonstrates how to build, test, and deploy a Solidity smart contract with NFT minting and royalty functionality. 

The `CreatorNFT` contract follows the ERC-721 standard and includes support for EIP-2981, enabling creators to earn royalties when their NFTs are sold.

## OpenZeppelin Contracts
The `CreatorNFT` contract leverages OpenZeppelin’s battle-tested libraries:

- **ERC-721**: Implements the standard for non-fungible tokens.
- **EIP-2981**: Adds royalty support for marketplaces.
- **Ownable**: Provides secure ownership and access control.

You can easily extend the contract with additional OpenZeppelin functionality, for example:
- **Pausable**: Pause and unpause contract functions.
- **ERC721Enumerable**: Enable enumeration of NFTs.

## Getting Started
Follow these steps to set up, deploy, and test the `CreatorNFT` contract.

### Prerequisites
- **Node.js**: Install Node.js (version 22 or later).
- **npm**: Ensure npm is installed with Node.js.
- **Hardhat**: A development environment for Ethereum.

To complete a Testnet deploy:
  - **Alchemy API key**: Free tier node provider, can modify easily for Infura.
  - **Private key**: Your wallet setup with some ETH on Sepolia, faucet info and links provided below.

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

## 4. Run Tests
Run the provided test suite to verify the contract functionality:
```bash
npx hardhat test
```
Example output:
```plaintext
CreatorNFT Contract
  ✔ Should deploy and set the correct owner
  ✔ Should mint a new NFT and assign it to the owner
  ✔ Should correctly set the default royalty for minted NFTs
  ✔ Should correctly set and retrieve tokenURI during minting
  ✔ Should allow the token owner to set custom royalties
  ✔ Should revert if a non-owner tries to mint an NFT
  ✔ Should revert if a non-owner tries to set royalties
  ✔ Should revert when querying tokenURI for a nonexistent token
  ✔ Should revert if a non-owner tries to set a tokenURI
  ✔ Should not allow royalties greater than 100%
  ✔ Should emit the correct events on mint and royalty updates
  
11 passing (495ms)
```

### Helpful Commands:
Clean the Cache
```bash
npx hardhat clean
```
Generate TypeChain Types
```bash
npx hardhat typechain
```

## 5. Deploy the Contract
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
    ```
    ```bash
    const { ethers } = require("hardhat");
    const creatorNFT = await ethers.getContractAt("CreatorNFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
    await creatorNFT.mint("ipfs://token-metadata");
    console.log("NFT minted successfully!");
    const owner = await creatorNFT.ownerOf(0); // Token ID 0
    console.log("Owner of Token ID 0:", owner);
    const tokenURI = await creatorNFT.tokenURI(0);
    console.log("URI of Token ID 0:", tokenURI);
    const royaltyInfo = await creatorNFT.royaltyInfo(0, 10000); // salePrice to check
    console.log("Royalty info of Token ID 0:", royaltyInfo);
    ```
    Example output:
    ```plaintext
    NFT minted successfully!
    Owner of Token ID 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    URI of Token ID 0: ipfs://token-metadata
    Royalty info of Token ID 0: Result(2) [ '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 500n ]
    ```
    ```plaintext
    ContractTransactionResponse {
      provider: HardhatEthersProvider {
        _hardhatProvider: LazyInitializationProviderAdapter {
          _providerFactory: [AsyncFunction (anonymous)],
          _emitter: [EventEmitter],
          _initializingPromise: [Promise],
          provider: [BackwardsCompatibilityProviderAdapter]
        },
        _networkName: 'localhost',
        _blockListeners: [],
        _transactionHashListeners: Map(0) {},
        _eventListeners: []
      },
      blockNumber: 2,
      blockHash: '0xcd3b7abb4389a5f562fcfad91ead6667a3a0aa4220e4fc7decf7ddcea720135b',
      index: undefined,
      hash: '0x9c56ab8ac2379ab00254f9320996aac5add44a470b5c603d82382575213332ad',
      type: 2,
      to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      nonce: 1,
      gasLimit: 30000000n,
      gasPrice: 1782895831n,
      maxPriorityFeePerGas: 1000000000n,
      maxFeePerGas: 1990852536n,
      maxFeePerBlobGas: null,
      data: '0x1249c58b',
      value: 0n,
      chainId: 31337n,
      signature: Signature { 
        r: "0x30a858483b6e760243fcd9eab25956b00916a8e298f9c512fb4906747e1280bd", 
        s: "0x5bdeea9dca0950ce4853fd7b0b5e7846563fe69d7262158a0460d257b6fb8568", 
        yParity: 0, 
        networkV: null 
      },
      accessList: [],
      blobVersionedHashes: null
    }
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

    Use Hardhat console with network sepolia, view on Alchemy Dashboard or Etherscan:
    - https://sepolia.etherscan.io/address/0x76053BBEeA8c1952f7884BF0Dfc2bCc6D9294d8D


## Test Minting with IPFS
To mint your NFT on a testnet and host its metadata and image on an IPFS provider e.g. Pinata:
1. Upload the Image to IPFS e.g. `nft/tech-owl.png`.
2. Update the `image` field in the metadata file with the IPFS URL of the uploaded image.
3. Upload the Metadata File to IPFS e.g. `nft/tech-owl-metadata.json`.
4. Update the `TOKEN_URI` const in the minting script e.g. `scripts/mint.js` with the IPFS URL of the uploaded metadata file.
5. Test Minting on a testnet
    - Deploy your contract to a testnet (e.g., Sepolia) if not already deployed.
    - Run the minting script. The script will use the `TOKEN_URI` pointing to your metadata and mint an NFT on the testnet.
    - Verify the NFT. Review on Etherscan and Rarible Testnet e.g. https://testnet.rarible.com/token/0x76053bbeea8c1952f7884bf0dfc2bcc6d9294d8d:0

## Sepolia Testnet Faucets

When deploying or testing on the Sepolia testnet, you’ll need Sepolia ETH to pay for gas. Most faucets have daily or hourly limits per address. 

**Testnet ETH has no real-world value and is for development purposes only.**

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

## References

### General Resources
- [Ethereum Official Website](https://ethereum.org/en/)
- [Ethers.js Documentation](https://docs.ethers.org/)

### Solidity
- [Solidity Documentation](https://docs.soliditylang.org/en/latest/)
- [Solidity by Example](https://solidity-by-example.org/)
- [Remix IDE](https://remix.ethereum.org/)

### Hardhat
- [Hardhat Official Documentation](https://hardhat.org/)
- [Hardhat GitHub Repository](https://github.com/NomicFoundation/hardhat)
- [Hardhat Plugins](https://hardhat.org/plugins/)
- [Hardhat Toolbox](https://hardhat.org/hardhat-toolbox/)

### OpenZeppelin
- [OpenZeppelin Contracts Documentation](https://docs.openzeppelin.com/contracts)
- [OpenZeppelin GitHub Repository](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/)

### Testnets and Deployment
- [Alchemy API Key Setup](https://www.alchemy.com/)
- [Infura API Key Setup](https://infura.io/)
- [Sepolia Testnet](https://sepolia.dev/)
- [Goerli Testnet](https://goerli.net/)

### Security and Best Practices
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Defender](https://openzeppelin.com/defender/)
- [Trail of Bits Slither](https://github.com/crytic/slither)
- [MythX](https://mythx.io/)

### NFTs and Standards
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [EIP-2981 Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)

### Useful Tools
- [Chainlist (Connect Wallets to Networks)](https://chainlist.org/)
- [Etherscan (Ethereum Block Explorer)](https://etherscan.io/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Solidity Visual Auditor (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor)
- [OpenZeppelin CLI (Legacy Tool)](https://docs.openzeppelin.com/cli)
