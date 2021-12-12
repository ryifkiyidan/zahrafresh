export interface Produk {
  key?:        string | null;
  id:         number;
  kode:       string;
  nama:       string;
  harga:      number;
  deskripsi:  string;
  isReady:    boolean;
  gambar:     string[];
  category:   Category;
}

export interface Category {
  id:   number;
  nama: string;
}
