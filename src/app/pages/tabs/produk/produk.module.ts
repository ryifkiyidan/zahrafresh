import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdukPageRoutingModule } from './produk-routing.module';

import { ProdukPage } from './produk.page';

import { SwiperModule
 } from 'swiper/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdukPageRoutingModule,
    SwiperModule
  ],
  declarations: [ProdukPage]
})
export class ProdukPageModule {}
