import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Produk } from './../models/produk.model';

@Injectable({
  providedIn: 'root'
})
export class ProdukService {

  constructor(
    private afDB: AngularFireDatabase
  ) { }

  get(key: string): AngularFireObject<Produk>{
    return this.afDB.object(`products/${key}`);
  }

  getAll(where?: string[]){
    if (where === undefined){
      return this.afDB.list(`products`);
    }
    return this.afDB.list(`products`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }

  update(key: string, value: any){
    this.afDB.list('products/').update(key, value);
  }

}
