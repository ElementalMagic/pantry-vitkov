import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../../shared/interfaces";
import {ProductsService} from "../../shared/services/products.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input('id') itemId: string;
  @Input('newClass') extraClass: string;
  item: Item;
  loadingComplete = false;
  constructor(private mainService:ProductsService) {
  }

  ngOnInit() {

    this.mainService.getItemById(this.itemId).subscribe(res=>{
      this.item = res;
      this.loadingComplete = true;
    });
  }

}
