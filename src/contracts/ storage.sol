// SPDX-License-Identifier: UNLICENSED

interface PriceOracle {
    function getPrice(uint256 _amount) external view returns (uint256);
}

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

contract SNSBetaTest is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    DefaultOperatorFilterer,
    Ownable
{
    using Counters for Counters.Counter;
    PriceOracle private priceOracle;
    Counters.Counter public _tokenIds;
    uint256 public pricePerMint = 50 * 10 ** 6; //  USD worth of SNS
    IERC20 public immutable SNS;
    string public tld;
    string public baseUri;
    bool public whitelistOnly;

    mapping(string => address) public domains;
    mapping(uint256 => string) public tokenToDomain;
    mapping(string => Records) public records;
    // mapping(string => bool) public premiumDomain;
    mapping(address => bool) public whitelisted;

    struct Records {
        string email;
        string url;
        string description;
        string avatar;
    }


    // error DomainReserved();

    constructor(
        string memory _tld,
        string memory _baseUri,
        address _snsTokenAddress,
        address _priceOracleAddress
    ) payable ERC721("SNS Beta Test", "SNSBT") {
        tld = _tld;
        baseUri = _baseUri;
        SNS = IERC20(_snsTokenAddress);
        priceOracle = PriceOracle(_priceOracleAddress);
        //whitelistOnly = true; // allow only whitelisters to mint
    }

    function register(string calldata name) public payable {
        if (whitelistOnly) {
            if (!whitelisted[msg.sender]) revert Unauthorized();
        }
        //if (premiumDomain[name]) revert DomainReserved();
        if (domains[name] != address(0)) revert DomainAlreadyOwned();
        if (!validateName(name)) revert NotAValidName();

        /*  require(
            SNS.transferFrom(msg.sender, address(this), getPrice()),
            "Not enough token received"
        );
 */
        string memory _name = string(abi.encodePacked(baseUri, name, ".", tld));
        uint256 newRecordId = _tokenIds.current();
        tokenToDomain[newRecordId] = name;

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, _name);
        domains[name] = msg.sender;

        emit mintedDomain(msg.sender, name, newRecordId);

        _tokenIds.increment();
    }

    function tokenURI(
        uint256 _tokenId
    )
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return
            bytes(baseUri).length > 0
                ? string(
                    abi.encodePacked(
                        baseUri,
                        string(abi.encodePacked(tokenToDomain[_tokenId]))
                    )
                )
                : "";
    }

    // GETTERS

    function getPrice() public view returns (uint256) {
        return priceOracle.getPrice(pricePerMint);
    }

    function getRecord(
        string calldata name
    ) public view returns (Records memory) {
        return records[name];
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    // SETTERS

    function setPrice(uint256 _newPrice) external onlyOwner {
        pricePerMint = _newPrice * 10 ** 6;
        emit mintPriceUpdated(_newPrice);
    }

    function allowWhiteListOnly(bool _allowWhiteListOnly) external onlyOwner {
        whitelistOnly = _allowWhiteListOnly;
    }

    function setRecord(string calldata name, Records calldata record) external {
        require(domains[name] == msg.sender);
        records[name].email = record.email;
        records[name].url = record.url;
        records[name].description = record.description;
        records[name].avatar = record.avatar;

        emit updatedRecords(
            name,
            record.email,
            record.url,
            record.description,
            record.avatar
        );
    }

    // Overrides required by solidity
    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     uint256 batchSize
    // ) internal override(ERC721, ERC721Enumerable) {
    //     string memory domain = tokenToDomain[tokenId];
    //     domains[domain] = to;
    //     Records storage record = records[domain];
    //     record.avatar = "";
    //     record.description = "";
    //     record.email = "";
    //     record.url = "";
    //     super._beforeTokenTransfer(from, to, tokenId, batchSize);
    //     emit domainTransfered(domain, from, to);
    // }

    // function _burn(
    //     uint256 tokenId
    // ) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    // function supportsInterface(
    //     bytes4 interfaceId
    // ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }

    // // Overrides required by OS-Operator-Filter
    // function setApprovalForAll(
    //     address operator,
    //     bool approved
    // ) public override(ERC721, IERC721) onlyAllowedOperatorApproval(operator) {
    //     super.setApprovalForAll(operator, approved);
    // }

    // function approve(
    //     address operator,
    //     uint256 tokenId
    // ) public override(ERC721, IERC721) onlyAllowedOperatorApproval(operator) {
    //     super.approve(operator, tokenId);
    // }

    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
    //     super.transferFrom(from, to, tokenId);
    // }

    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
    //     super.safeTransferFrom(from, to, tokenId);
    // }

    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     bytes memory data
    // ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
    //     super.safeTransferFrom(from, to, tokenId, data);
    // }

    // Owner Fucntions

    /* function addPremiumDomain(string[] memory _domainArray) external onlyOwner {
        uint256 length = _domainArray.length;
        for (uint256 i; i < length; i++) {
            require(validateName(_domainArray[i]));
            premiumDomain[_domainArray[i]] = true;
        }
    } */

    function mintPremiumDomains(string[] memory _domains) external onlyOwner {
        uint256 length = _domains.length;
        for (uint256 i; i < length; i++) {
            if (domains[_domains[i]] != address(0)) revert DomainAlreadyOwned();
            if (!validateName(_domains[i])) revert NotAValidName();

            string memory _name = string(
                abi.encodePacked(baseUri, _domains[i], ".", tld)
            );
            uint256 newRecordId = _tokenIds.current();
            tokenToDomain[newRecordId] = _domains[i];

            _safeMint(msg.sender, newRecordId);
            _setTokenURI(newRecordId, _name);
            domains[_domains[i]] = msg.sender;

            emit mintedDomain(msg.sender, _domains[i], newRecordId);

            _tokenIds.increment();
        }
    }

    function remove() external onlyOwner {
        SNS.transfer(owner(), SNS.balanceOf(address(this)));
    }

    // Helpers
    function validateName(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);
        if (b.length < 1) return false;
        if (b.length > 40) return false; // Cannot be longer than 40 characters
        if (b[0] == 0x20) return false; // Leading space
        if (b[b.length - 1] == 0x20) return false; // Trailing space

        for (uint i; i < b.length; i++) {
            bytes1 char = b[i];

            if (char == 0x20) return false; // Cannot contain  spaces

            if (
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x2D) //- carriage return
            ) return false;
        }
        return true;
    }
}