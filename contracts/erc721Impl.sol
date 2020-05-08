pragma solidity >=0.5.0 <0.7.0;

import "./ERC721.sol";

contract ERC721Impl is ERC721 {

    event NewToken(uint tokenId);

    mapping (uint => address) ownerApprovals;

    mapping (uint => address) public tokenToOwner;
    mapping (address => uint) ownerTokenCount;

  function balanceOf(address _owner) external view returns (uint256) {
    return ownerTokenCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address){
    return tokenToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerTokenCount[_to]++;
    ownerTokenCount[_from]--;
    tokenToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) external payable{
    require (tokenToOwner[_tokenId] == msg.sender || ownerApprovals[_tokenId] == msg.sender,"Not authen");
    _transfer(_from, _to, _tokenId);
  }
   modifier onlyOwnerOf(uint _tokenId) {
    require(msg.sender == tokenToOwner[_tokenId],"Not is owner");
    _;
  }

  function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
    ownerApprovals[_tokenId] = _approved;
    emit Approval(msg.sender, _approved, _tokenId);
  }

    //thêm token cho địa chỉ mới
    function mint(uint256 _id) public {
        require(msg.sender != address(0), "ERC721: mint to the zero address");
        tokenToOwner[_id] = msg.sender;
        ownerTokenCount[msg.sender]++;
        emit NewToken(_id);
    }

    function burn(uint256 tokenId) public {
        address own = ownerOf(tokenId);
        tokenToOwner[tokenId] = address(0);
        ownerTokenCount[own]--;
        emit Transfer(own, address(0), tokenId);
    }
}
