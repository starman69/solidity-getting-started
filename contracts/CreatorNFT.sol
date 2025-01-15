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

    mapping(uint256 => address) public creators;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => RoyaltyInfo) private _tokenRoyalties;

    event TokenMinted(uint256 tokenId, address creator, string ipfsURI);
    event RoyaltySet(uint256 tokenId, address recipient, uint256 royaltyFraction);
    event TokenURIUpdated(uint256 indexed tokenId, string newTokenURI);

    constructor(uint256 _defaultRoyaltyPercentage) ERC721("CreatorNFT", "CNFT") Ownable(msg.sender) {
        defaultRoyaltyPercentage = _defaultRoyaltyPercentage;
    }

    // ERC-721 Token URI implementation
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
    
    // Function to set token URI
    function setTokenURI(
        uint256 tokenId,
        string memory tokenURI_
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI set for nonexistent token");
         _setTokenURI(tokenId, tokenURI_);
    }

    // Internal function to set the token URI (can include IPFS hash)
    function _setTokenURI(
        uint256 tokenId,
        string memory tokenURI_
    ) internal {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = tokenURI_;

        // Emit the event when the URI is updated
        emit TokenURIUpdated(tokenId, tokenURI_);
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

    // Set royalties for a specific token
    function setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint256 royaltyFraction
    ) external {
        require(_ownerOf(tokenId) == msg.sender, "Only the token owner can set royalties");
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

    // Mint a new NFT and set the creator and tokenURI
    function mint(string memory ipfsURI) external onlyOwner {
        creators[nextTokenId] = msg.sender;

        // Mint the token
        _safeMint(msg.sender, nextTokenId);
        _setTokenURI(nextTokenId, ipfsURI);

        // Set default royalties
        _setTokenRoyalty(nextTokenId, msg.sender, defaultRoyaltyPercentage);

        emit TokenMinted(nextTokenId, msg.sender, ipfsURI);
        nextTokenId++;
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
