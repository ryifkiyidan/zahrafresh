import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Keranjang } from 'src/app/models/keranjang.model';
import { KeranjangService } from 'src/app/services/keranjang.service';

@Component({
  selector: 'app-keranjang',
  templateUrl: './keranjang.page.html',
  styleUrls: ['./keranjang.page.scss'],
})
export class KeranjangPage implements OnInit {

  keranjangs?: Keranjang[];
  keranjangForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private keranjangService: KeranjangService,
  ) { }

  ngOnInit() {
    this.keranjangForm = this.formBuilder.group({
      namaPembeli: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nomorPembeli: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      namaPenerima: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nomorPenerima: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  async ionViewWillEnter(){
    await this.keranjangService.getKeranjangs().then(res => this.keranjangs = res);
  }

  tambah(id: number){
    const keranjang = this.keranjangs.find(item => item.produk.id === id);
    const newKeranjangs = this.keranjangService.tambahProduk(this.keranjangs, keranjang.produk);
    this.keranjangs = newKeranjangs;
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  kurang(id: number){
    const keranjang = this.keranjangs.find(item => item.produk.id === id);
    const newKeranjangs = this.keranjangService.kurangProduk(this.keranjangs, keranjang.produk);
    this.keranjangs = newKeranjangs;
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  isAddedToCart(id: number){
    if(this.keranjangs){
      return this.keranjangs.find(item => item.produk.id === id) ? true : false;
    }else{
      return false;
    }
  }

  getQtyProduct(id: number){
    const keranjang = this.keranjangs.find(item => item.produk.id === id);
    return keranjang.jumlah;
  }

  getTotalHargaKeranjang(){
    let total = 0;
    this.keranjangs.forEach(keranjang => {
      total += keranjang.totalHarga;
    });
    return total;
  }

  openUrl(url){
    window.open(encodeURI(url));
  }

  rupiahFormat(value: number){
    const reverse = value.toString().split('').reverse().join('');
    const ribuan = reverse.match(/\d{1,3}/g).join('.').split('').reverse().join('');
    return ribuan;
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'confirm-alert',
      header: 'Apakah anda yakin?',
      message: 'Pastikan pesanan dan data pengiriman sudah benar',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Iya',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
      ],
    });

    await alert.present();
  }

}
