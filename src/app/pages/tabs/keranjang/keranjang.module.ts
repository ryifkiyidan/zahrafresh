import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeranjangPageRoutingModule } from './keranjang-routing.module';

import { KeranjangPage } from './keranjang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeranjangPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [KeranjangPage]
})
export class KeranjangPageModule {}
