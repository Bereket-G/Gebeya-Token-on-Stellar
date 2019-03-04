import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as StellarSdk from 'stellar-sdk';
import { Router } from '@angular/router';

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

@Component({
  selector: 'app-link',
  templateUrl: 'link.page.html',
  styleUrls: ['link.page.scss']
})
export class LinkPage implements OnInit {
  
  privateKey: string

  constructor(
    public router: Router, private storage: Storage
  ) {  }
 
  linkForm() {
    let key = StellarSdk.StrKey.isValidEd25519SecretSeed(this.privateKey)
   if(key){
     const keypair = StellarSdk.Keypair.fromSecret(this.privateKey)
     this.storage.set('account', { publicKey: keypair.publicKey(), privateKey: keypair.secret()});
     this.router.navigateByUrl('/home');
   }

  
  }

  ngOnInit() {
  }

}
