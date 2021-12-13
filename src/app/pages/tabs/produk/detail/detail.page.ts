import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Produk } from 'src/app/models/produk.model';
import { ProdukService } from 'src/app/services/produk.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Clipboard } from '@capacitor/clipboard';
import { Keranjang } from 'src/app/models/keranjang.model';
import { KeranjangService } from 'src/app/services/keranjang.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, AfterContentChecked {

  @ViewChild('swiper') swiper: SwiperComponent;

  produkKey: string;
  subscription: Subscription;
  produk: Produk;
  produkBackup: Produk;
  currentPageUrl: string;

  keranjangs?: Keranjang[];

  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: {clickable: true},
    initialSlide: 0,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private toastController: ToastController,
    private produkService: ProdukService,
    private keranjangService: KeranjangService,
  ) { }

  ngAfterContentChecked(){
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('key')) {
        this.produkKey = paramMap.get('key');
        this.subscription = this.produkService.get(this.produkKey).valueChanges().subscribe(res => {
          this.produk = res;
          this.produkBackup = this.produk;
        });
        this.currentPageUrl = 'https://zahrafresh.com' + this.router.url;
      }else{
        this.navController.pop();
      }
    });
  }

  async ionViewWillEnter(){
    await this.keranjangService.getKeranjangs().then(res => this.keranjangs = res);
  }

  tambah(){
    const newKeranjangs = this.keranjangService.tambahProduk(this.keranjangs, this.produk);
    this.keranjangs = newKeranjangs;
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  kurang(){
    const newKeranjangs = this.keranjangService.kurangProduk(this.keranjangs, this.produk);
    this.keranjangs = newKeranjangs;
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  isAddedToCart(){
    if(this.keranjangs && this.produk){
      return this.keranjangs.find(item => item.produk.id === this.produk.id) ? true : false;
    }else{
      return false;
    }
  }

  getQtyProduct(){
    const keranjang = this.keranjangs.find(item => item.produk.id === this.produk.id);
    return keranjang.jumlah;
  }

  getTotalHargaKeranjang(){
    let total = 0;
    this.keranjangs.forEach(keranjang => {
      total += keranjang.totalHarga;
    });
    return total;
  }

  async copyLink(){
    // eslint-disable-next-line id-blacklist
    await Clipboard.write({string: this.currentPageUrl});
    await this.presentToast('Link produk telah disalin');
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'light',
      position: 'top',
    });
    toast.present();
  }

  rupiahFormat(value?: number){
    if(value){
      const reverse = value.toString().split('').reverse().join('');
      const ribuan = reverse.match(/\d{1,3}/g).join('.').split('').reverse().join('');
      return ribuan;
    }
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }
}
