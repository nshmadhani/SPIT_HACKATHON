pragma solidity ^0.4.2;
contract ContractSystem {
    
    
    event logs(string indexed value1);
    event loga(address indexed value1);
    event logi(uint indexed value1);
    
    
    
    
    
    enum State{Completed,Disputed,Ongoing,Verified}
    
    uint256 public constractIDCount = 0;

    struct User {
        string name;
        address  wallet_address;
    }

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

    

    
    mapping(uint => UserContract)  allContracts;
    
    mapping(address => User) public users;
    
    mapping(address => uint256) public balances;
    
    

    

    //given user wallet fetch UserContracts
    

    
    
    
    function createUserContract(string memory _terms, uint _amount,address   _toPartyAdress) public  {
        
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
   
    function getUserContracts() public  returns(uint[] memory) {
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
    
    
    
    
    
    function JobCompleted(uint _contractID) public {
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


    /***************************CONTRACT GETTER***********************/
    
    function getContractTerms(uint _contractID) public returns(string memory){
        return allContracts[_contractID].terms;
    }
    function getContractAmount(uint _contractID) public returns(uint ){
        return allContracts[_contractID].amount;
    }
    function getContractTimeStamp(uint _contractID) public returns(uint ){
        return allContracts[_contractID].createdOnTimestamp;
    }
    function getContractToPartyName(uint _contractID) public returns(string ){
        return allContracts[_contractID].toParty.name;
    }
    function getContractFromPartyName(uint _contractID) public returns(string  ){
        return allContracts[_contractID].fromParty.name;
    }
    function getContractStatus(uint _contractID) public returns(uint){
        State a  = allContracts[_contractID].status;
        if(a == State.Verified) {
            return 2;
        } else if(a == State.Completed) {
            return 3;
        } else if(a == State.Disputed){
            return 4;
        } else return 1;//Ongoing 
    }
    function getClient(uint _contractID) public returns(string) {
        
        UserContract usc = allContracts[_contractID]; 
        if(msg.sender  == usc.toParty.wallet_address) {
            return usc.fromParty.name;
        } else if(msg.sender  == usc.fromParty.wallet_address) {
            return usc.toParty.name;
        } else return "";
    }
}