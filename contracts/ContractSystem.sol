pragma solidity ^0.4.22;
contract ContractSystem {
    
    
    event logs(string indexed value1);
    event loga(address indexed value1);
    event logi(uint indexed value1);
    
    enum State{Completed,Disputed,Ongoing,Verified}
    
    uint256 dummyValue;
    address toCoWllet;
    address fromCoWallet;
    
    
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
        uint status;
    }
    
    struct User {
        string name;
        address wallet_address;
    }
    

    
    mapping(uint => UserContract) allContracts;
    
    mapping(address => User) public users;
    
    
    //given user wallet fetch UserContracts
    
    
    
    
    function createUserContract(string memory _terms, uint _amount,address _toPartyAdress) public payable {
        
        require(msg.sender != _toPartyAdress);
        
        dummyValue = msg.value;
        fromCoWallet = msg.sender;
        toCoWllet = _toPartyAdress;
        
        constractIDCount++;
        allContracts[constractIDCount] =  UserContract(constractIDCount,
                                                     _terms,
                                                     _amount,
                                                     block.timestamp,
                                                     users[msg.sender],
                                                     users[_toPartyAdress],
                                                     false,
                                                     false,
                                                     1);
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
            _userContract.status = 2;
        }
        
    }
    
    
    modifier bothVerified(uint _contractID) {
        require(allContracts[_contractID].status == 2, "Both not verified");
        _;
    }
    
    
    function JobCompleted(uint _contractID) public {
        //require(allContracts[_contractID].status == State.Verified);
        UserContract storage _userContract = allContracts[_contractID];
        require(_userContract.status == 2, "Both not verified");
        require(msg.sender == _userContract.fromParty.wallet_address,"not Address");
         _userContract.status = 3;
        //address toWallet = _userContract.toParty.wallet_address;
        // toWallet.transfer(msg.value);
        toCoWllet.transfer(dummyValue);
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
        return allContracts[_contractID].status; 
    }
    function getContractFromPartyVerified(uint _contractID) public returns(bool){
        return allContracts[_contractID].fromPartyVerified; 
    }
    function getContractToPartyVerified(uint _contractID) public returns(bool){
        return allContracts[_contractID].toPartyVerified; 
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