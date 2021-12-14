import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonCheckbox } from '@ionic/angular';
import { Keranjang } from 'src/app/models/keranjang.model';
import { KeranjangService } from 'src/app/services/keranjang.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-keranjang',
  templateUrl: './keranjang.page.html',
  styleUrls: ['./keranjang.page.scss'],
})
export class KeranjangPage implements OnInit {

  @ViewChild('allCheckBox') allCheckBox: IonCheckbox;

  keranjangs?: Keranjang[];
  keranjangForm: FormGroup;

  waktuPengiriman:  any;
  currentDate: Date;
  dateOption1: Date;
  dateOption2: Date;
  dateOption3: Date;

  provinsis: any = [];
  kabupatens: any = [];
  kecamatans: any = [];
  kelurahans: any = [];
  baseHref = 'https://api.binderbyte.com/wilayah/';

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private keranjangService: KeranjangService,
    private http: HttpClient,
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
    this.getProvinsi();
    const day = 60 * 60 * 24 * 1000;
    this.currentDate = new Date();
    this.dateOption1 = new Date(this.currentDate.getTime() + day);
    this.dateOption2 = new Date(this.currentDate.getTime() + day + day);
    this.dateOption3 = new Date(this.currentDate.getTime() + day + day + day);
  }

  async ionViewWillEnter(){
    await this.keranjangService.getKeranjangs().then(res => this.keranjangs = res);
  }

  getProvinsi(){
    this.http.get(this.baseHref + 'provinsi?' + 'api_key=' + environment.binderByteKey).subscribe(res => {
      const tempRes: any = res;
      this.provinsis = tempRes.value
        .filter(item => item.id === '36')
        .sort((a, b) => {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
    });
  }

  getKabupaten(ev){
    this.http.get(
        this.baseHref + 'kabupaten?' +
        'api_key=' + environment.binderByteKey +
        '&id_provinsi=' + ev.target.value
      ).subscribe(res => {
        const tempRes: any = res;
        this.kabupatens = tempRes.value
          .filter(item => item.id === '3603' || item.id === '3671' || item.id === '3674')
          .sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
      });
  }

  getKecamatan(ev){
    this.http.get(
        this.baseHref + 'kecamatan?' +
        'api_key=' + environment.binderByteKey +
        '&id_kabupaten=' + ev.target.value
      ).subscribe(res => {
        const tempRes: any = res;
        this.kecamatans = tempRes.value
          .sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
      });
  }

  getKelurahan(ev){
    this.http.get(
        this.baseHref + 'kelurahan?' +
        'api_key=' + environment.binderByteKey +
        '&id_kecamatan=' + ev.target.value
      ).subscribe(res => {
        const tempRes: any = res;
        this.kelurahans = tempRes.value
          .sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
      });
  }

  onChangeCheckBox(produkId){
    const index = this.keranjangs.findIndex(keranjang => keranjang.produk.id === produkId);
    this.keranjangs[index].isChecked = !this.keranjangs[index].isChecked;
  }

  onClickAllCheckBox(){
    if(this.allCheckBox.checked){
      this.keranjangs = this.keranjangs.map(({isChecked, ...rest}) => ({...rest, isChecked: true}));
    }else{
      this.keranjangs = this.keranjangs.map(({isChecked, ...rest}) => ({...rest, isChecked: false}));
    }
  }

  isAllChecked(){
    return this.keranjangs.every(keranjang => keranjang.isChecked === true);
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

  deleteSelectedProduk(){
    this.keranjangs = this.keranjangs.filter(keranjang => keranjang.isChecked !== true);
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  getQtyProduct(id: number){
    const keranjang = this.keranjangs.find(item => item.produk.id === id);
    return keranjang.jumlah;
  }

  getTotalHarga(type: string){
    let totalHargaDiskon = 0;
    let totalHargaAsli = 0;
    this.keranjangs.forEach(keranjang => {
      if(keranjang.isChecked){
        totalHargaDiskon += keranjang.totalHarga;
        totalHargaAsli += keranjang.totalHargaAsli;
      }
    });
    if(type === 'isHaveDiskon'){
      return totalHargaAsli !== totalHargaDiskon ? 1 : 0;
    }
    else if(type === 'diskon'){
      return totalHargaDiskon;
    }else{
      return totalHargaAsli;
    }
  }

  openUrl(url){
    window.open(encodeURI(url));
  }

  rupiahFormat(value: number){
    const reverse = value.toString().split('').reverse().join('');
    const ribuan = reverse.match(/\d{1,3}/g).join('.').split('').reverse().join('');
    return ribuan;
  }

  tanggalFormat(date) {
    const monthNames = [
      'Januari', 'Februari', 'Maret',
      'April', 'Mei', 'Juni', 'Juli',
      'Agustus', 'September', 'Oktober',
      'November', 'Desember'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex].substring(0,3);
  }

  async presentAlertConfirm(msg, action) {
    const alert = await this.alertController.create({
      cssClass: 'confirm-alert',
      header: 'Apakah anda yakin?',
      message: msg,
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
            if(action === 'delete'){
              this.deleteSelectedProduk();
            }else if(action === 'checkout'){
              console.log('Checkout berhasil');
            }
          },
        },
      ],
    });

    await alert.present();
  }

}
