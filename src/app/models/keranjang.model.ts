import { Produk } from './produk.model';

export interface Keranjang {
  id?:          string | null;
  produk:       Produk;
  jumlah:       number;
  totalHarga:   number;
}
