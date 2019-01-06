
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
      if(App.userName === "" ){
        console.log("going to auth"); 
        window.location.href = "./auth.html";
      }else{
        $("#userName").html("Welcome "+ result);
      }

    });


    App.render();
  },

  render: function() {
    var electionInstance;
    // var loader = $("#loader");
    // var content = $("#content");
    var label= $("#label");


    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        
      }
    });

    web3.eth.getBalance(App.account,function(err,balance){
      App.balance = balance;
      $("#accountBalance").html("balance : "+ balance);
    });


    console.log("loading all contracts");
    App.contracts.ContractSystem.deployed().then(function(instance){

     return UserContract.getAllContracts(App.account , instance);

   }).then(function(result){
      


      if(window.location.href.includes("index.html")) {
         App.checkUser();
      }

      console.log(result);
    }).catch(function(err){
      console.log(err);
    });


    //


    // Load contract data
    // App.contracts.Election.deployed().then(function(instance) {
    //   electionInstance = instance;

    //   return electionInstance.candidatesCount();
    // }).then(function(candidatesCount) {
    //   var candidatesResults = $("#candidatesResults");
    //   candidatesResults.empty();

    //   var candidatesSelect = $('#candidatesSelect');
    //   candidatesSelect.empty();

    //   for (var i = 1; i <= candidatesCount; i++) {
    //     electionInstance.candidates(i).then(function(candidate) {
    //       var id = candidate[0];
    //       var name = candidate[1];
    //       var voteCount = candidate[2];

    //       // Render candidate Result
    //       var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
    //       candidatesResults.append(candidateTemplate);

    //       // Render candidate ballot option
    //       var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
    //       candidatesSelect.append(candidateOption);
    //     });
    //   }
    //   return electionInstance.voters(App.account);
    // }).then(function(hasVoted) {
    //   // Do not allow a user to vote
    //   if(hasVoted) {
    //     $('form').hide();
    //   }
    //   loader.hide();
    //   content.show();
    // }).catch(function(error) {
    //   console.warn(error);
    // });
  },

//   castVote: function() {
//     var candidateId = $('#candidatesSelect').val();
//     App.contracts.Election.deployed().then(function(instance) {
//       return instance.vote(candidateId, { from: App.account });
//     }).then(function(result) {
//       // Wait for votes to update
//       $("#content").hide();
//       $("#loader").show();
//       alert(candidateId);
//     }).catch(function(err) {
//       console.error(err);
//     });
//   }
// };

  // createContract: function(){
  //   var to = $('#to').getText();
  //   alert(to);
  //   return true;
  // };


 //$('#submit').click(function(){
    makeContract : function() {
    var to = $('#to').val();
    var amount =  parseInt($('#amount').val());
    var terms = $('#terms').val();

    console.log(to + amount+ terms);

    App.contracts.ContractSystem.deployed().then(function(instance){

      return instance.createUserContract(terms,amount,to ,{from : App.account,value: amount});
    }).then(function(result){
      alert(successfull);
    }).catch(function(err){
      alert('error' + err);
    });

  },

  verify : function(){

    alert('verify!!');
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
