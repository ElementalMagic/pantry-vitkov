import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsService} from "../shared/services/products.service";
import {Item} from "../shared/interfaces";
import LazyLoad from "vanilla-lazyload";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styles:[':host{' +
  'display:flex;' +
  'flex-wrap: wrap;' +
  'justify-content: space-between;' +
  'align-items: flex-start;}']
})
export class ProductPageComponent implements OnInit {

  item: Item;
  loadingComplete = false;
  collectionItems : Item[];
  collectionLoadingComplete = false;

  constructor(private route: ActivatedRoute, private mainService: ProductsService) { }

  ngOnInit() {

    this.route.params.subscribe(params=>{
        if(params['id']){
          this.mainService.getItemById(params['id']).subscribe(res=>{
            this.item = res;
            this.loadingComplete = true;
            var myLazyLoad = new LazyLoad({
              elements_selector: ".lazy"
            });

            this.mainService.getCollectionAndCollectionItemsById({limit: 4}, this.item.collectionId).subscribe(res=>{
              this.collectionItems = res.collectionItems;
              this.collectionLoadingComplete = true;
              var myLazyLoad = new LazyLoad({
                elements_selector: ".lazyItems"
              });
            })
          });

        }
      }
    )
  }

}
