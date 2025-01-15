// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract CreatorNFT is ERC721, Ownable, IERC2981 {
    uint256 public nextTokenId;
    uint256 public defaultRoyaltyPercentage; // Default royalty percentage in basis points (500 = 5%)

    struct RoyaltyInfo {
        address recipient;
        uint256 royaltyFraction; // Basis points (e.g., 500 = 5%)
    }

    mapping(uint256 => RoyaltyInfo) private _tokenRoyalties;
    mapping(uint256 => address) public creators;

    event TokenMinted(uint256 tokenId, address creator);
    event RoyaltySet(uint256 tokenId, address recipient, uint256 royaltyFraction);

    constructor(uint256 _defaultRoyaltyPercentage) ERC721("CreatorNFT", "CNFT") Ownable(msg.sender) {
        defaultRoyaltyPercentage = _defaultRoyaltyPercentage;
    }

    // Mint a new NFT and set the creator
    function mint() external onlyOwner {
        creators[nextTokenId] = msg.sender;

        // Mint the token
        _safeMint(msg.sender, nextTokenId);

        // Set default royalties
        _setTokenRoyalty(nextTokenId, msg.sender, defaultRoyaltyPercentage);

        emit TokenMinted(nextTokenId, msg.sender);
        nextTokenId++;
    }

    // Set royalties for a specific token
    function setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint256 royaltyFraction
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Only the token owner can set royalties");
        require(royaltyFraction <= 10000, "Royalty cannot exceed 100%");

        _setTokenRoyalty(tokenId, recipient, royaltyFraction);
    }

    // Internal function to set token royalties
    function _setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint256 royaltyFraction
    ) internal {
        _tokenRoyalties[tokenId] = RoyaltyInfo(recipient, royaltyFraction);
        emit RoyaltySet(tokenId, recipient, royaltyFraction);
    }

    // EIP-2981 royalty info implementation
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address, uint256)
    {
        RoyaltyInfo memory royalty = _tokenRoyalties[tokenId];
        uint256 royaltyAmount = (salePrice * royalty.royaltyFraction) / 10000;
        return (royalty.recipient, royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
