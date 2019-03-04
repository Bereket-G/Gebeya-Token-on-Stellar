import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as StellarSdk from 'stellar-sdk';
// var StellarSdk = require('stellar-sdk')
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SendTokenService {

  horizonUrl = 'https://horizon-testnet.stellar.org';
  server = new StellarSdk.Server(this.horizonUrl);
  sourceKeys: any;
  constructor(private storage: Storage) {

    this.storage.get('account').then(value => {
      if (value === null) {
        alert('Account not found !');
        return;
      }

      this.sourceKeys = StellarSdk.Keypair
        .fromSecret(value.privateKey);

    });
  }

  sendToken(destinationId: string): any {

    var stellarResult;
    StellarSdk.Network.useTestNetwork();

    var destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    var transaction;

    // First, check to make sure that the destination account exists.
    this.server.loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(StellarSdk.NotFoundError, function (error) {
        throw new Error('The destination account does not exist!');
        // return 'The destination account does not exist!';
      })

      // If there was no error, load up-to-date information on the account.
      .then(() => {
        return this.server.loadAccount(this.sourceKeys.publicKey());
      })

      .then((sourceAccount) => {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount)
          .addOperation(StellarSdk.Operation.payment({
            destination: destinationId,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: StellarSdk.Asset.native(),
            amount: "100"
          }))

          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text('Test Transaction'))
          .setTimeout(10)
          .build();

        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(this.sourceKeys);

        // And finally, send it off to Stellar!
        return this.server.submitTransaction(transaction);
      })
      .then((result) => {
        return this.server.operations()
          .forTransaction(result.hash)
          .call();

        // console.log('Success! Results:', result);
        // stellarResult = "Success"
      })
      .then((_response_) => {
        console.log(_response_.records[0].transaction_successful);
        return _response_.records[0].transaction_successful
      })
      .catch(function (error) {
        console.error('Something went wrong!', error);
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        //this.server.submitTransaction(transaction);
      });
  }
}
