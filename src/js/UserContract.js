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
                    contractIndexList.forEach(function(contractID) {
                        UserContract.getContract(contractInstance,contractID).then(function(a) {
                            userContracts[++index] = a;
                            console.log(a,index,contractIndexList.length);
                            if(index === contractIndexList.length - 1) {
                                
                                res(userContracts);
                            }
                        });
                        
                    });
                })
        });
    }

    static async getContract(contractInstance,contractID)   {
        
        var amount = (await  contractInstance.getContractAmount.call(contractID)).toNumber();
        var terms = await   contractInstance.getContractTerms.call(contractID);
        var status = (await  contractInstance.getContractStatus.call(contractID)).toNumber();
        var client = await  contractInstance.getClient.call(contractID);

        return  {
            amount:amount,
            terms:terms,
            status:status,
            client:client
        }            

    }
}