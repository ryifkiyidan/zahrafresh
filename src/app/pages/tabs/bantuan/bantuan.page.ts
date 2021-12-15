import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bantuan',
  templateUrl: './bantuan.page.html',
  styleUrls: ['./bantuan.page.scss'],
})
export class BantuanPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openUrl(url){
    window.open(encodeURI(url));
  }

}
