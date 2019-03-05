import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as StellarSdk from 'stellar-sdk';

@Component({
    selector: 'app-buy-token',
    templateUrl: './buy-token.page.html',
    styleUrls: ['./buy-token.page.scss'],
})
export class BuyTokenPage implements OnInit {

    public account: any;
    ASSETCODE= "GBYT";
    sourceKeys: any;
    accountBalances: any;
    hasTrustLine = false;
    public amount = 4;
    horizonUrl = 'https://horizon-testnet.stellar.org';
    server: any;
    issuerAccount = {
        'PublicKey': 'GDP6QEA4A5CRNGUIGYHHFETDPNEESIZFW53RVISXGSALI7KXNUC4YBWD'
    };

    constructor(private storage: Storage) {

    }

    ngOnInit() {

        this.server = new StellarSdk.Server(this.horizonUrl);

        StellarSdk.Network.useTestNetwork();

        this.storage.get('account').then(value => {
            if (value === null) {
                alert('Account not found !');
                return;
            }

            this.account = value;
            // fetching accound details 
            this.server.accounts()
                .accountId(this.account.publicKey)
                .call()
                .then((accountResult) => {
                    console.log(accountResult.balances);
                    this.accountBalances = accountResult.balances;
                })
                .catch(function (err) {
                    alert("Network Error");
                    console.error(err);
                });

        });






    }

    async buyToken() {

        let messages = [];
        let returnObject = {
            data: {},
            message: messages
        };

        let operations = [];

        // check if account has enought balance
        if (this.accountBalances)
            this.accountBalances.map((balance) => {
                if (balance.asset_code === this.ASSETCODE && balance.asset_issuer === this.issuerAccount.PublicKey) {
                    this.hasTrustLine = true;
                }
            })



        try {
            const receiverDetail = await this.server.loadAccount(this.account.publicKey);
            console.log('rcvrDetails: ', receiverDetail);

            // build a transaction
            let transaction = new StellarSdk.TransactionBuilder(receiverDetail);

            if (!this.hasTrustLine) {
                let customAsset = new StellarSdk.Asset(this.ASSETCODE, this.issuerAccount.PublicKey);
                let operationObj = {
                    asset: customAsset
                };

                transaction.addOperation(StellarSdk.Operation.changeTrust(operationObj));
            }

            transaction.addOperation(StellarSdk.Operation.manageOffer({
                buying: new StellarSdk.Asset(this.ASSETCODE, this.issuerAccount.PublicKey),
                selling: StellarSdk.Asset.native(),
                amount: String(this.amount),
                price: 100
            }))


            // build and sign transaction
            let builtTx =  transaction.setTimeout(30).build();
            builtTx.sign(StellarSdk.Keypair.fromSecret(this.account.privateKey));

            this.server.submitTransaction(builtTx)
                .then((result) => {
                    console.log(result);
                    return this.server.operations()
                        .forTransaction(result.hash)
                        .call();
                }).then((_response_) => {
                    console.log(_response_.records[0].transaction_successful);
                    // this.resultToken = _response_.records[0].transaction_successful;
                    return _response_.records[0].transaction_successful;
                }).then(() => {
                    console.log('Success');
                })

        } catch (error) {
            console.log("error: ", error);
            messages.push('An error occured. Check logs');
        }
    }
}
