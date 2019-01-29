class UserContract {
    static getAllContracts(userAddress,contractInstance) {
        return new Promise(function(res,rej) {
            
            contractInstance.getUserContracts.call({from:userAddress})
                .then(function(contractIndexList) {
                    return contractIndexList.map(x => x.toNumber());
                })
                .then(function(contractIndexList) {
                    var index = -1;
                    var userContracts = [];
                    console.log(contractIndexList)
                    contractIndexList.forEach(function(contractID) {
                        

                        UserContract.getContract(contractInstance,contractID).then(function(a) {
                            userContracts[++index] = a;
                            console.log(a);
                            if(index === contractIndexList.length - 1) {
                                res(userContracts);
                            }
                        });
                        
                    });

                    if(index === -1 && contractIndexList.length === 0 ) {
                        res([]);
                    }
                })
        });
    }
    static async getContract(contractInstance,contractID)   {
        var amount = (await  contractInstance.getContractAmount.call(contractID)).toNumber();
        var terms = await   contractInstance.getContractTerms.call(contractID);
        var status = (await  contractInstance.getContractStatus.call(contractID)).toNumber();
        var client = await  contractInstance.getClient.call(contractID);

        var fromPartyVerified = await  contractInstance.getContractFromPartyVerified.call(contractID);
        var toPartyVerified = await  contractInstance.getContractToPartyVerified.call(contractID);





        if(status === 1) {
            status = "Ongoing";
        } else if(status === 2) {
            status = "Verified";
        } else if(status === 3) {
            status = "Completed";
        } else {
            status = "Dispute";
        }
        
        return  {
            id:contractID,
            amount:amount,
            terms:terms,
            status:status,
            client:client,
            fromPartyVerified,
            toPartyVerified
        }            
    }

}