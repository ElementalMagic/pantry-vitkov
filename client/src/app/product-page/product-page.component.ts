import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsService} from "../shared/services/products.service";
import {Item} from "../shared/interfaces";
import LazyLoad from "vanilla-lazyload";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styles: [':host{' +
  'display:flex;' +
  'flex-wrap: wrap;' +
  'justify-content: space-between;' +
  'align-items: flex-start;}']
})
export class ProductPageComponent implements OnInit {

  item: Item;
  loadingComplete = false;
  collectionItems: Item[];
  collectionLoadingComplete = false;

  constructor(private route: ActivatedRoute, private mainService: ProductsService, private title: Title, private meta: Meta) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        if (params['id']) {
          this.mainService.getItemById(params['id']).subscribe(res => {
            this.title.setTitle(res.title);
            this.item = res;
            this.loadingComplete = true;
            var myLazyLoad = new LazyLoad({
              elements_selector: ".lazy"
            });

            this.mainService.getCollectionAndCollectionItemsById({limit: 4}, this.item.collectionId).subscribe(res => {
              this.collectionItems = res.collectionItems;
              this.collectionLoadingComplete = true;
              this.meta.addTag({
                name: 'description',
                content: `${this.item.title} - коллекция ${res.collection.name}. ${res.collection.title}`
              });
              this.meta.addTags([{
                  property: "og:title", content: this.item.title
                },
                {
                  property: "og:type", content: 'website'
                },
                {
                  property: "og:url", content: `http://pvitkov.ru/collection/${this.item._id}`
                },
                {
                  property: "og:image", content: `http://pvitkov.ru/images/${this.item.imgSrc}`
                }
              ]);
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
