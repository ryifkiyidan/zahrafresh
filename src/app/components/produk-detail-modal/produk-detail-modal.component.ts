import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([
  Pagination,
]);

@Component({
  selector: 'app-produk-detail-modal',
  templateUrl: './produk-detail-modal.component.html',
  styleUrls: ['./produk-detail-modal.component.scss'],
})
export class ProdukDetailModalComponent implements OnInit, AfterContentChecked {

  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: {clickable: true},
    initialSlide: 0,
  };

  constructor(
    private modalController: ModalController,
  ) { }

  ngAfterContentChecked(){
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {}

  goBack(){
    this.modalController.dismiss();
  }
}
