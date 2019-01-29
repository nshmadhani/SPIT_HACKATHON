
App = {
  web3Provider: null,
  contracts: {},
  account: '0xEa1F84CE8643B5DfDA6DAece2680ED7AcF92207e',
  hasVoted: false,
  balance: 0,
  userName: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);  
      }
    });
    $.getJSON("ContractSystem.json", function(system){
        App.contracts.ContractSystem = TruffleContract(system);
        App.contracts.ContractSystem.setProvider(App.web3Provider);
        App.listenForEvents();
        return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.ContractSystem.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.logs({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        // App.checkUser();
        
      });
    });

    // var name = $("#newName").val();
    //   console.log(name);
    // if(name!==""){
    //   App.createUser(name);  
    //   console.log("going to index");
    //   setTimeout(function(){window.location.href="./index.html";},5000); 
    // }
    

   

  },

  checkUser: function(){

    console.log("starting checkUser");

    App.contracts.ContractSystem.deployed().then(function(instance){
      
      return instance.users(App.account);

    }).then(function(result){

      App.userName=result[0];
      console.log(App.userName);
      if(App.userName === "" ){
        console.log("going to auth"); 
        window.location.href = "./auth.html";
      }else{
        $("#user").html("Welcome "+ App.userName);
      }

    });
  },

  render: function() {
    var electionInstance;
    // var loader = $("#loader");
    // var content = $("#content");
    var label= $("#label");


    web3.eth.getBalance(App.account,function(err,balance){
      App.balance = balance;
      $("#accountBalance").html("balance : "+ web3.fromWei(balance));
    });


    
    if(window.location.href.includes("index.html")) {
      console.log("User Checking")
      App.checkUser();
      App.showTransactions();
    } else if(window.location.href.includes("edit_contract.html"))  {
      getTheDeets();
    }

  },
  makeContract : function() {
    var to = $('#to').val();
    var amount =  parseInt($('#amount').val());
    var terms = $('#terms').val();


    App.contracts.ContractSystem.deployed().then(function(instance){
      return instance.createUserContract(terms,amount,to ,{from : App.account,value: web3.toWei(amount)});
    }).then(function(result){
      alert(successfull);
    }).catch(function(err){
      alert('error' + err);
    });

  },

  verify : function(){
    alert('verify!!');
  },


  showTransactions: function() {
    console.log("Showing Transactions")
    App.contracts.ContractSystem.deployed().then(function(instance){
      return UserContract.getAllContracts(App.account,instance);
    }).then(function(contracts){   
      console.log(contracts);
      contracts.forEach((contract) => {
        $('#myTable').append(`<tr><td>${contract.id}</td><td>${contract.client}</td><td>${contract.amount}</td><td>${contract.status}</td></tr>`);
      });
      return;
    })
    .then(() => {
      $("tr").click(function() {
        var tableData = $(this).children("td").map(function() {
              return $(this).text();
        }).get();
        window.location.href = "./edit_contract.html?contractID="+tableData[0];
      });  
    })
    .catch(function(err){
      console.error(err);
    });
  },


  



  createUser: function(name){
    
    App.contracts.ContractSystem.deployed().then(function(instance){

      return instance.addUser(name,{from : App.account});
    }).then(function(result){
      alert('account created');
    });
  }
};


//0xc9470f5d89cec1104dabd9af95c017f767db4bdd

  
  
$(function() {
  $(window).load(function() {
    App.init(); 
  });
});


// $('table tr').on('click', 'td', function () {
//   var a=10;

//    var tableData = $(this).children("td").map(function() {
//         return $(this).text();
//     }).get();

//     alert("Your data is: " + $.trim(tableData[0]) + " , " + $.trim(tableData[1]) + " , " + $.trim(tableData[2]));

//    window.location.href = "./edit_contract.html?amount="+a;
// });
