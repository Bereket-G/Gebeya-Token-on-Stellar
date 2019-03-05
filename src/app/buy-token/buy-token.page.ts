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
  sourceKeys: any;
  public amount = 451;
  horizonUrl = 'https://horizon-testnet.stellar.org';
  server = new StellarSdk.Server(this.horizonUrl);
  issuerAccount = {
    'PrivateKey' : 'SBDBUA25ZEEGKPYYXT5KAQL4RGR3QUNATQKRJ4LHLCDL2ELEHMSKXZBI',
    'PublicKey' : 'GDP6QEA4A5CRNGUIGYHHFETDPNEESIZFW53RVISXGSALI7KXNUC4YBWD'
  };

  constructor(private storage: Storage) {

    StellarSdk.Network.useTestNetwork();

    this.storage.get('account').then(value => {
      if (value === null) {
        alert('Account not found !');
        return;
      }

      this.sourceKeys = StellarSdk.Keypair
          .fromSecret(value.privateKey);

    });
  }

  ngOnInit() {
    this.createOffer();
  }

  createOffer() {

    this.storage.get('account').then(value => {
      if (value === null) {
        alert('Public key not found !');
        return;
      }
      this.account = value;
    });

    // First, check to make sure that the destination account exists.
    this.server.loadAccount(this.issuerAccount.PublicKey)
    // If the account is not found, surface a nicer error message for logging.
        .catch(StellarSdk.NotFoundError, function (error) {
          throw new Error('The destination account does not exist!');
        })
        // If there was no error, load up-to-date information on the account.
        .then(() => {
          return this.server.loadAccount(this.sourceKeys.publicKey());
        })
        .then((sourceAccount) => {
          // Start building the transaction.
          const transaction = new StellarSdk.TransactionBuilder(sourceAccount)
              .addOperation(StellarSdk.Operation.manageOffer({
                buying : new StellarSdk.Asset('GBYT', this.issuerAccount.PublicKey),
                selling : StellarSdk.Asset.native(),
                // Because Stellar allows transaction in many currencies, you must
                // specify the asset type. The special "native" asset represents Lumens.
                amount: '7845',
                price : 0.01
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
        }).then((result) => {
          console.log(result);
      return this.server.operations()
          .forTransaction(result.hash)
          .call();

      // console.log('Success! Results:', result);
      // stellarResult = "Success"
    }).then((_response_) => {
      console.log(_response_.records[0].transaction_successful);
      // this.resultToken = _response_.records[0].transaction_successful;
      return _response_.records[0].transaction_successful;
    }).then(() => {
      console.log('Success');
    })
        .catch((error) => {
          console.error('Something went wrong!', error);
          // If the result is unknown (no response body, timeout etc.) we simply resubmit
        });


  }

}
