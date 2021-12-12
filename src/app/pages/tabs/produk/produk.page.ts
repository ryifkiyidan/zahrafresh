import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';
import { Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { Produk } from './../../../models/produk.model';
import { ProdukService } from './../../../services/produk.service';
import { NavController } from '@ionic/angular';
import { KeranjangService } from 'src/app/services/keranjang.service';
import { Keranjang } from 'src/app/models/keranjang.model';


SwiperCore.use([
  Pagination,
  Autoplay
]);

@Component({
  selector: 'app-produk',
  templateUrl: './produk.page.html',
  styleUrls: ['./produk.page.scss'],
})
export class ProdukPage implements OnInit, AfterContentChecked {

  @ViewChild('swiper') swiper: SwiperComponent;

  produkSubscription: Subscription;
  keranjangSubscription: Subscription;

  produks?: Produk[];
  produksBackup?: Produk[];
  keranjangs?: Keranjang[];

  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: {clickable: true},
    initialSlide: 0,
    loop: true,
    autoplay: {delay: 4000},
  };

  constructor(
    private produkService: ProdukService,
    private navController: NavController,
    private keranjangService: KeranjangService,
  ) { }

  ngAfterContentChecked(){
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  async ngOnInit() {
    this.produkSubscription = this.produkService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Produk }))
      )
    ).subscribe( res => {
      this.produks = res;
      this.produksBackup = this.produks;
    });
    await this.keranjangService.getKeranjangs().then(res => { this.keranjangs = res; console.log(res);} );
  }

  searchProduk(ev){
    this.produks = this.produksBackup;
    const keyword = ev.srcElement.value;
    if (!keyword){
      return;
    }

    this.produks = this.produks.filter(produk => {
      if (produk.nama && keyword) {
        return (
          produk.nama.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
          produk.deskripsi.toLowerCase().indexOf(keyword.toLowerCase()) > -1
        );
      }
    });
  }

  tambah(id: number){
    const produk = this.produks.find(item => item.id === id);
    const newKeranjangs = this.keranjangService.tambahProduk(this.keranjangs, produk);
    this.keranjangs = newKeranjangs;
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  kurang(id: number){
    const produk = this.produks.find(item => item.id === id);
    const newKeranjangs = this.keranjangService.kurangProduk(this.keranjangs, produk);
    this.keranjangs = newKeranjangs;
    this.keranjangService.setKeranjangs(this.keranjangs);
  }

  isAddedToCart(id: number){
    return this.keranjangs.find(item => item.produk.id === id) ? true : false;
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

  ionViewDidLeave() {
    this.produkSubscription.unsubscribe();
  }

}
