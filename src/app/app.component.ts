import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  localStorage: Storage | null = null;

  constructor(
    private storage: Storage
  ) {
    this.init();
  }

  async init(){
    const storage = await this.storage.create();
    this.localStorage = storage;

    try {
      const keranjangs = await this.localStorage?.get('keranjangs').then((res) => res);
      if(!keranjangs){
        await this.localStorage?.set('keranjangs', []);
      }else{
        console.log(keranjangs);
      }
    } catch(err) {
      console.error(err);
    }
  }
}
