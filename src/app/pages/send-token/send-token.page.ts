import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SendTokenService } from 'src/app/services/send-token.service';

@Component({
  selector: 'app-send-token',
  templateUrl: './send-token.page.html',
  styleUrls: ['./send-token.page.scss'],
})
export class SendTokenPage implements OnInit {

  results: Observable<any>;
  destinationId: string = '';

  constructor(private sendTokenService: SendTokenService) { }

  ngOnInit() {
  }

  submitToken() {
    // Call our service function which returns an Observable
    this.results = this.sendTokenService.sendToken(this.destinationId);
  }

}
