import { Component, OnInit } from '@angular/core';
import * as StellarSdk from 'stellar-sdk';
import { Storage } from '@ionic/storage';
//import config from 'config';
//const config = require('config');
//const StellarSdk = require('stellar-sdk');
//const Utility = require('./utility');

@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.page.html',
  styleUrls: ['./buy-token.page.scss'],
})
export class BuyTokenPage implements OnInit {

  RECEIVER: any;
  ISSUER: "GDP6QEA4A5CRNGUIGYHHFETDPNEESIZFW53RVISXGSALI7KXNUC4YBWD";
  ASSETCODE = "GBYT";


  constructor(private storage: Storage) {
    this.storage.get('account').then(value => {
      if (value === null) {
        alert('Account not found !');
        return;
      }

      this.RECEIVER = StellarSdk.Keypair
        .fromSecret(value.privateKey);

    });
  }

  createTrustLine() {
    let messages = [];
    let returnObject = {
      data: {},
      message: messages
    };
    //const SENDER = config.get("sender");

    // Initialisae the horizon Server
    StellarSdk.Config.setAllowHttp(true);
    StellarSdk.Network.useTestNetwork();
    //let horizonServer = new StellarSdk.Server(config.get("horizonUrl"));
    let horizonUrl = 'https://horizon-testnet.stellar.org';
    let server = new StellarSdk.Server(horizonUrl);

    // create trustline from receiver to issuer
    messages = [];

    try {

      // Get receiver account detail
      const receiverDetail = server.loadAccount(this.RECEIVER.publicKey);
      console.log('rcvrDetails: ', receiverDetail);

      // build a transaction
      let transaction = new StellarSdk.TransactionBuilder(receiverDetail);

      // add a change trust operation
      let customAsset = new StellarSdk.Asset(this.ASSETCODE, this.ISSUER);
      let operationObj = {
        asset: customAsset
      };

      transaction.addOperation(StellarSdk.Operation.changeTrust(operationObj));

      // build and sign transaction
      let builtTx = transaction.build();
      builtTx.sign(StellarSdk.Keypair.fromSecret(this.RECEIVER.privateKey));

      // submit transaction to horizonServer
      let result = server.submitTransaction(builtTx);
      if (!result) {
        messages.push("Horizon Error");
        throw new Error("horizon Error");
      } else {
        messages.push('Transaction submitted successfully');
        returnObject.data = result;
        returnObject.message = messages;
        console.log('Return Obj: ', returnObject);
        return Promise.resolve(returnObject);
      }

    } catch (error) {
      console.log("error: ", error);
      messages.push('An error occured. Check logs');
      return Promise.reject(messages);
    }
  }

  ngOnInit() {
  }

}
