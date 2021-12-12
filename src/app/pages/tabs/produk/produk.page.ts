import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';
import { ModalController } from '@ionic/angular';
import { ProdukDetailModalComponent } from './../../../components/produk-detail-modal/produk-detail-modal.component';
import { Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { Produk } from './../../../models/produk.model';
import { ProdukService } from './../../../services/produk.service';


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
    autoplay: {delay: 3000},
  };

  constructor(
    private modalController: ModalController,
    private produkService: ProdukService
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

  async openProdukDetailModal(key){
    const modal = await this.modalController.create({
      component: ProdukDetailModalComponent,
      // componentProps: {
      //   apartemen: this.apartemens.find(res => res.key === key)
      // }
    });
    await modal.present();
  }

  onClick(){
    console.log('click');
  }

  rupiahFormat(value: number){
    const reverse = value.toString().split('').reverse().join('');
    const ribuan = reverse.match(/\d{1,3}/g).join('.').split('').reverse().join('');
    return ribuan;
  }

}
