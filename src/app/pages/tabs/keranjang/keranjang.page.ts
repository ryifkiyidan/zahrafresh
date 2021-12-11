import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-keranjang',
  templateUrl: './keranjang.page.html',
  styleUrls: ['./keranjang.page.scss'],
})
export class KeranjangPage implements OnInit {

  keranjangForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.keranjangForm = this.formBuilder.group({
      namaPembeli: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nomorPembeli: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      namaPenerima: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nomorPenerima: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

}
