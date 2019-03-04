import { Component } from '@angular/core';
import StellarSdk from 'stellar-sdk';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public balances: []; // an account can have multiple tokens
  server: any;
  publicKey: string;

  constructor(private storage: Storage) {

      this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

      this.storage.get('account').then(value => {
          if (value === null) {
              alert('Public key not found !');
              return;
          }
          this.publicKey = value.publicKey;
          this.getBalance();
      });

  }


  getBalance(): void {

    this.server.accounts()
        .accountId(this.publicKey)
        .call()
        .then( (accountResult) =>  {
          console.log(accountResult.balances);
          this.balances = accountResult.balances;
          if (this.balances.length > 0) {
          }
        })
        .catch(function (err) {
          console.error(err);
        });
  }

}
