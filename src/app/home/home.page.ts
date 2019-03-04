import { Component } from '@angular/core';
import StellarSdk from 'stellar-sdk';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public balances: []; // an account can have multiple tokens
  server: any;

  constructor() {
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    this.getBalance();
  }


  getBalance(): void {

    this.server.accounts()
        .accountId('GDOJCPYIB66RY4XNDLRRHQQXB27YLNNAGAYV5HMHEYNYY4KUNV5FDV2F')
        .call()
        .then( (accountResult) =>  {
          console.log(accountResult.balances);
          this.balances = accountResult.balances;
          console.log(this.balances[0]);
        })
        .catch(function (err) {
          console.error(err);
        });
  }

}
