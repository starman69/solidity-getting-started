/// <reference types="hardhat/types" />
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { CreatorNFT, CreatorNFT__factory } from "../typechain-types";
import hre from "hardhat";
import { ethers } from "ethers";

describe("CreatorNFT Contract", function () {
    let creatorNFT: CreatorNFT;
    let owner: any;
    let addr1: any;
    let addr2: any;
    const ipfsURI = "ipfs://token-metadata";

    beforeEach(async function () {
        // Get the contract factory
        const CreatorNFTFactory: CreatorNFT__factory = await hre.ethers.getContractFactory("CreatorNFT");

        // Get signers
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        // Deploy the contract (directly cast as CreatorNFT)
        creatorNFT = (await CreatorNFTFactory.deploy(500)) as CreatorNFT;

        // No need to call deployed(); ethers v6 automatically resolves deployment
    });

    it("Should deploy and set the correct owner", async function () {
        expect(await creatorNFT.owner()).to.equal(owner.address);
    });

    it("Should mint a new NFT and assign it to the owner", async function () {
        await creatorNFT.mint(ipfsURI);
        expect(await creatorNFT.ownerOf(0)).to.equal(owner.address);
    });

    it("Should correctly set the default royalty for minted NFTs", async function () {
        await creatorNFT.mint(ipfsURI);
        const [recipient, royaltyAmount] = await creatorNFT.royaltyInfo(0, ethers.parseEther("1"));
        expect(recipient).to.equal(owner.address);
        expect(royaltyAmount).to.equal(ethers.parseEther("0.05")); // 5% of 1 ETH
    });

    it("Should correctly set and retrieve tokenURI during minting", async function () {
        await creatorNFT.mint(ipfsURI);
    
        // Check the tokenURI
        expect(await creatorNFT.tokenURI(0)).to.equal(ipfsURI);
    });

    it("Should allow the token owner to set custom royalties", async function () {
        await creatorNFT.mint(ipfsURI);

        // Set custom royalties for token ID 0
        await creatorNFT.setTokenRoyalty(0, addr1.address, 1000); // 10% royalty

        const [recipient, royaltyAmount] = await creatorNFT.royaltyInfo(0, ethers.parseEther("1"));
        expect(recipient).to.equal(addr1.address);
        expect(royaltyAmount).to.equal(ethers.parseEther("0.1")); // 10% of 1 ETH
    });

    it("Should revert if a non-owner tries to mint an NFT", async function () {
        await expect(creatorNFT.connect(addr1).mint(ipfsURI))
        .to.be.revertedWithCustomError(creatorNFT, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address); // addr1.address is the unauthorized account
    });

    it("Should revert if a non-owner tries to set royalties", async function () {
        await creatorNFT.mint(ipfsURI);
        await expect(
            creatorNFT.connect(addr1).setTokenRoyalty(0, addr2.address, 1000)
        ).to.be.revertedWith("Only the token owner can set royalties");
    });

    it("Should revert when querying tokenURI for a nonexistent token", async function () {
        await expect(creatorNFT.tokenURI(999)).to.be.revertedWith(
            "ERC721Metadata: URI query for nonexistent token"
        );
    });

    it("Should revert if a non-owner tries to set a tokenURI", async function () {
        await creatorNFT.mint(ipfsURI); // Mint a token
    
        const customURI = "ipfs://unauthorizedURI/";
        await expect(creatorNFT.connect(addr1).setTokenURI(0, customURI))
            .to.be.revertedWithCustomError(creatorNFT, "OwnableUnauthorizedAccount");
    });

    it("Should not allow royalties greater than 100%", async function () {
        await creatorNFT.mint(ipfsURI);
        await expect(creatorNFT.setTokenRoyalty(0, addr1.address, 10001)).to.be.revertedWith(
            "Royalty cannot exceed 100%"
        );
    });

    it("Should emit the correct events on mint and updates", async function () {
        await expect(creatorNFT.mint(ipfsURI))
            .to.emit(creatorNFT, "TokenMinted")
            .withArgs(0, owner.address, ipfsURI);

        await expect(creatorNFT.setTokenRoyalty(0, addr1.address, 1000))
            .to.emit(creatorNFT, "RoyaltySet")
            .withArgs(0, addr1.address, 1000);

        const newURI = ipfsURI + "/more"
        await expect(creatorNFT.setTokenURI(0, newURI))
            .to.emit(creatorNFT, "TokenURIUpdated")
            .withArgs(0, newURI);
    });
});
