// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title DienerMintNFT
/// @notice ERC-721 contract for the CRCP 6340 mint project.
/// Assembled from the OpenZeppelin wizard (Enumerable, URIStorage,
/// Royalty, Ownable) with a public payable mintTo function, supply
/// and price enforcement, payout distribution, and custom events.
contract DienerMintNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC2981,
    Ownable,
    ReentrancyGuard
{
    uint256 private _nextTokenId;
    uint256 private immutable _mintPrice;
    uint256 private immutable _maxSupply;
    string private _customBaseURI;
    address payable private immutable _payoutAddress;

    event MintCompleted(address indexed minter, uint256 indexed tokenId, string tokenURI);
    event FundsDistributed(address indexed payee, uint256 amount);

    constructor(
        uint256 mintPrice_,
        uint256 maxSupply_,
        string memory baseURI_,
        address royaltyArtist,
        uint96 royaltyBasisPoints
    ) ERC721("DienerMintApp", "DMA") Ownable(msg.sender) {
        _mintPrice = mintPrice_;
        _maxSupply = maxSupply_;
        _customBaseURI = baseURI_;
        _payoutAddress = payable(msg.sender);
        _setDefaultRoyalty(royaltyArtist, royaltyBasisPoints);
    }

    /// @notice Public mint. Anyone paying the exact mint price receives
    /// the next token, and funds forward immediately to the payout address.
    function mintTo(string memory uri) public payable nonReentrant returns (uint256) {
        require(msg.value == _mintPrice, "DienerMintNFT: send exact mint price");
        require(_nextTokenId < _maxSupply, "DienerMintNFT: max supply reached");

        uint256 tokenId = _nextTokenId;
        _nextTokenId += 1;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        emit MintCompleted(msg.sender, tokenId, uri);

        (bool sent, ) = _payoutAddress.call{value: msg.value}("");
        require(sent, "DienerMintNFT: payout transfer failed");
        emit FundsDistributed(_payoutAddress, msg.value);

        return tokenId;
    }

    function getMintPrice() public view returns (uint256) {
        return _mintPrice;
    }

    function getMaxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    function getBaseURI() public view returns (string memory) {
        return _customBaseURI;
    }

    /// @notice Collection-level metadata pointer read by marketplaces like OpenSea.
    function contractURI() public view returns (string memory) {
        return _customBaseURI;
    }

    // ---- Required overrides: Solidity demands these when combining
    // ---- ERC721 with Enumerable, URIStorage, and ERC2981.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
