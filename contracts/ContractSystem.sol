pragma solidity ^0.5.0;
contract ContractSystem {
    
    
    event logs(string indexed value1);
    event loga(address indexed value1);
    event logi(uint indexed value1);
    
    
   constructor() public payable {
       
   }
    
    
    
    enum State{Completed,Disputed,Ongoing,Verified}
    
    uint256 public constractIDCount = 0;
    struct UserContract {
        uint256 id;
        string terms;
        uint amount;
        uint256 createdOnTimestamp;
        User fromParty;
        User toParty;
        bool fromPartyVerified;
        bool toPartyVerified;
        State status;
    }
    
    struct User {
        string name;
        address payable wallet_address;
    }
    

    
    mapping(uint => UserContract) allContracts;
    
    mapping(address => User) public users;
    
    mapping(address => uint256) public balances;
    
    
    //given user wallet fetch UserContracts
    
    
    
    
    function createUserContract(string memory _terms, uint _amount,address payable  _toPartyAdress) public payable {
        
        require(msg.sender != _toPartyAdress);
        
        constractIDCount++;
        allContracts[constractIDCount] =  UserContract(constractIDCount,
                                                     _terms,
                                                     _amount,
                                                     block.timestamp,
                                                     users[msg.sender],
                                                     users[_toPartyAdress],
                                                     false,
                                                     false,
                                                     State.Ongoing);
    }
    
    function addUser(string memory _name) public  {
        users[msg.sender] = User(_name,msg.sender);
    }
   
    function getUserContracts() public view returns(uint[] memory) {
        User memory user = users[msg.sender];
        uint[] memory thisUsersContracts = new uint[](constractIDCount);
        uint k = 0;
        for (uint i=0; i<constractIDCount; i++) {
            if(allContracts[i].fromParty.wallet_address == user.wallet_address || 
                allContracts[i].toParty.wallet_address == user.wallet_address) {
                thisUsersContracts[k]  = i;
                k++;
            }
            
        }
        return thisUsersContracts;
    }
    
    
    function verifyUserContract(uint _contractID) public {
        UserContract storage _userContract = allContracts[_contractID];
        if(msg.sender == _userContract.toParty.wallet_address) {
            _userContract.toPartyVerified = true;
        } else if(msg.sender == _userContract.fromParty.wallet_address) {
            _userContract.fromPartyVerified = true;
        }
        
        if(_userContract.fromPartyVerified && _userContract.toPartyVerified) {
            _userContract.status = State.Verified;
        }
        
    }
    
    
    
    
    
    function JobCompleted(uint _contractID) public payable{
        UserContract storage _userContract = allContracts[_contractID];
        require(msg.sender == _userContract.fromParty.wallet_address);
        require(State.Verified == _userContract.status);
        _userContract.status = State.Completed;
        balances[msg.sender]++;
        
        _userContract.toParty.wallet_address.transfer(_userContract.amount);
        
    }
    
    
    
    //Temp Contract
    
    //Contracts Done
    
    //Active Disputes

}