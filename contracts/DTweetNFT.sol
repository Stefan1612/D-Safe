// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract DTweetNFT is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    Counters.Counter private _tokenCounter;

    event TokenCreated(
        uint256 indexed currentId,
        string tokenURI,
        address indexed minter
    );

    constructor()
        //string memory _newBaseURI
        ERC721("D-Tweet-NFT", "DTN")
    {
        _grantRole(MINTER_ROLE, msg.sender);
    }

    struct Tweet {
        uint16 tokenID; // +1/day = 179 years worth of ID's
        string tokenURI;
        address owner;
    }

    Tweet[] public arrayOffAllTweets;

    //mapping(uint16 => Tweet) public IdToTweet;

    function getAllMintedTokens() external view returns (Tweet[] memory) {
        /*uint16 currentId = uint16(_tokenCounter.current());
        Tweet[] memory returnArray = new Tweet[](currentId);
        for (uint16 i = 1; i <= currentId; i++) {
            returnArray[i - 1] = IdToTweet[i];
        }
        return returnArray; // 37223 gas*/
        return arrayOffAllTweets; // 36514 gas
    }

    function mintTweet(address _account, string memory _tokenURI)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        _tokenCounter.increment();
        uint16 currentId = uint16(_tokenCounter.current());
        _safeMint(_account, currentId); // checks if id is already minted
        _setTokenURI(currentId, _tokenURI);
        arrayOffAllTweets.push(Tweet(currentId, _tokenURI, _account));
        //IdToTweet[currentId] = Tweet(currentId, _tokenURI, _account);
        emit TokenCreated(currentId, _tokenURI, _account);
        return currentId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
