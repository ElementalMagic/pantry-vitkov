import {Component, Input, OnInit} from '@angular/core';
import {Collection, Item} from "../../shared/interfaces";
import {ProductsService} from "../../shared/services/products.service";
import LazyLoad from "vanilla-lazyload";

@Component({
  selector: 'app-single-collection',
  templateUrl: './single-collection.component.html',
  styleUrls: ['./single-collection.component.css']
})
export class SingleCollectionComponent implements OnInit {

  @Input('collection') collection: Collection;

  items: Item[];
  itemsLoaded = false;

  constructor(private mainService: ProductsService) {
  }

  ngOnInit() {

    if (this.collection) {
      this.mainService.getCollectionAndCollectionItemsById({limit: 6}, this.collection._id).subscribe(
        obj => {
          this.items = obj.collectionItems;
          this.itemsLoaded = true;
          var myLazyLoad = new LazyLoad({
            elements_selector: ".lazy"
          });
        }, err => {
          console.log(err);
        }
      )
    }
  }

  delete(id: string) {
    this.mainService.deleteItem(id).subscribe(res => {
      let index = this.items.findIndex(p=> { return p._id === id});
      this.items.splice(index,1);
      console.log(res);
    });
  }



}
