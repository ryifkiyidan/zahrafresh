import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';
import { ModalController } from '@ionic/angular';
import { ProdukDetailModalComponent } from './../../../components/produk-detail-modal/produk-detail-modal.component';

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

  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: {clickable: true},
    initialSlide: 1,
    loop: true,
    autoplay: {delay: 3000},
  };

  constructor(
    private modalController: ModalController,
  ) { }

  ngAfterContentChecked(){
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
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

}
