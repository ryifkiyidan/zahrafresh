import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Keranjang } from '../models/keranjang.model';
import { Produk } from '../models/produk.model';

@Injectable({
  providedIn: 'root'
})
export class KeranjangService {

  localStorage: Storage | null = null;

  constructor(
    private storage: Storage
  ) { }

  async getKeranjangs(): Promise<Keranjang[]>{
    const storage = await this.storage.create();
    this.localStorage = storage;

    try {
      const keranjangs = await this.localStorage?.get('keranjangs').then((res) => res);
      if(keranjangs.length > 0){
        return JSON.parse(keranjangs);
      }
    } catch(err) {
      console.error(err);
    }
  }

  async setKeranjangs(keranjangs: Keranjang[]){
    const storage = await this.storage.create();
    this.localStorage = storage;
    try {
      await this.localStorage?.set('keranjangs', JSON.stringify(keranjangs));
    } catch(err) {
      console.error(err);
    }
  }

  tambahProduk(keranjangs: Keranjang[], produk: Produk){
    let tempKeranjangs = [];
    if(!keranjangs){
      const tempKeranjang = {
        produk,
        jumlah: 1,
        totalHarga: (produk.harga * (100 - produk.diskon) / 100)
      };
      tempKeranjangs.push(tempKeranjang);
    }else{
      const keranjang = keranjangs.find(res => res.produk.id.toString() === produk.id.toString());
      if(!keranjang){
        const tempKeranjang = {
          produk,
          jumlah: 1,
          totalHarga: (produk.harga * (100 - produk.diskon) / 100)
        };
        tempKeranjangs = keranjangs;
        tempKeranjangs.push(tempKeranjang);
      }else{
        const tempKeranjang = {
          produk: keranjang.produk,
          jumlah: keranjang.jumlah + 1,
          totalHarga: (keranjang.produk.harga * (100 - keranjang.produk.diskon) / 100) * (keranjang.jumlah + 1)
        };
        const i = keranjangs.findIndex(item => item.produk.id === keranjang.produk.id);
        keranjangs[i] = tempKeranjang;
        tempKeranjangs = keranjangs;
      }
    }
    return tempKeranjangs;
  }

  kurangProduk(keranjangs: Keranjang[], produk: Produk){
    let tempKeranjangs = [];
    const keranjang = keranjangs.find(res => res.produk.id.toString() === produk.id.toString());
    if(keranjang.jumlah <= 1){
      tempKeranjangs = keranjangs.filter(res => res.produk.id !== produk.id);
    }else{
      const tempKeranjang = {
        produk: keranjang.produk,
        jumlah: keranjang.jumlah - 1,
        totalHarga: (keranjang.produk.harga * (100 - keranjang.produk.diskon) / 100) * (keranjang.jumlah - 1)
      };
      const i = keranjangs.findIndex(item => item.produk.id === keranjang.produk.id);
      keranjangs[i] = tempKeranjang;
      tempKeranjangs = keranjangs;
    }
    return tempKeranjangs;
  }
}
