import { Component, OnInit } from '@angular/core';

const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

@Component({
  selector: 'app-create',
  templateUrl: 'create.page.html',
  styleUrls: ['create.page.scss']
})
export class CreatePage implements OnInit {
  
  constructor() {

  }

  ngOnInit() {
  }

}
