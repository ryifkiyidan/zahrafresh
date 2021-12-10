import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/produk',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'produk',
        loadChildren: () => import('./produk/produk.module').then( m => m.ProdukPageModule)
      },
      {
        path: 'keranjang',
        loadChildren: () => import('./keranjang/keranjang.module').then( m => m.KeranjangPageModule)
      },
      {
        path: 'bantuan',
        loadChildren: () => import('./bantuan/bantuan.module').then( m => m.BantuanPageModule)
      },
      {
        path: 'akun',
        loadChildren: () => import('./akun/akun.module').then( m => m.AkunPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
