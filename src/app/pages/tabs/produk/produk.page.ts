import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';
import { Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { Produk } from './../../../models/produk.model';
import { ProdukService } from './../../../services/produk.service';
import { NavController } from '@ionic/angular';


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

  subscription: Subscription;
  produks?: Produk[];
  produksBackup?: Produk[];

  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: {clickable: true},
    initialSlide: 0,
    loop: true,
    autoplay: {delay: 4000},
  };

  constructor(
    private produkService: ProdukService,
    private navController: NavController
  ) { }

  ngAfterContentChecked(){
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
    this.subscription = this.produkService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Produk }))
      )
    ).subscribe( res => {
      this.produks = res;
      this.produksBackup = this.produks;
    });
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

  onClick(){
    console.log('click');
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
    this.subscription.unsubscribe();
  }

}
