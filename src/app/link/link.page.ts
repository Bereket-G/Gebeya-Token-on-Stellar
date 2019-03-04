import { Component, OnInit } from '@angular/core';
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
    public router: Router
  ) {  }
 
  linkForm() {
    let key = StellarSdk.StrKey.isValidEd25519SecretSeed(this.privateKey)
   console.log(key)

   this.router.navigateByUrl('/home');
  }

  ngOnInit() {
  }

}
