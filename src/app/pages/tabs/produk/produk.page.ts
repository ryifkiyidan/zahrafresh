import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';

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

  constructor() { }

  ngAfterContentChecked(){
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
  }

}
