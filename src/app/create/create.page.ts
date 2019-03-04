import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as StellarSdk from 'stellar-sdk';

// const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

@Component({
  selector: 'app-create',
  templateUrl: 'create.page.html',
  styleUrls: ['create.page.scss']
})
export class CreatePage implements OnInit {
  loading = false;
  accountCreated = false;
  newAccount = { publicKey: '', privateKey: '' };
  constructor(private storage: Storage) {
  }

  generateAccount() {
    const pair = StellarSdk.Keypair.random();
    return { publicKey: pair.publicKey(), privateKey: pair.secret() };
  }

  createAccount() {
    this.loading = true;
     this.accountCreated = false;
    StellarSdk.Network.useTestNetwork();
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    this.newAccount = this.generateAccount();
     fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(this.newAccount.publicKey)}`
      )
      .then((result) => {
        result.json().then(data => {
          console.log(data);
          this.loading = false;
          this.accountCreated = true;
          this.storage.set('account', this.newAccount);
        });
      })
      .catch((err) => {
          console.error('ERROR!', err);
          this.loading = false;
      });
  }

  ngOnInit() {
  }

}
