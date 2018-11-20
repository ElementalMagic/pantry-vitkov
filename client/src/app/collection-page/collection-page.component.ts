import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {of} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {ProductsService} from "../shared/services/products.service";
import {Collection, CollectionItems, ProductType, ProductTypeItem} from "../shared/interfaces";
import Siema from 'siema/dist/siema.min.js';


let OFFSET = 0;
const STEP = 12;

@Component({
  selector: 'app-collection-page',
  templateUrl: './collection-page.component.html',
  styleUrls: ['./collection-page.component.css']
})
export class CollectionPageComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input('load') loadingComplete;

  constructor(private route: ActivatedRoute, private mainService: ProductsService) {
  }

  mySiema;
  pageTypeDefine = false;
  isCollectionPage = false;
  typeAndItemsArr: ProductType;
  collection: CollectionItems;
  pages = [];
  showAllMode = false;

  ngOnInit() {
    this.loadingComplete = false;

    this.route.queryParams.subscribe(params => {
        this.updateVars();

        if (params['prodType']) {
          this.isCollectionPage = false;
          this.pageTypeDefine = true;
          this.mainService.getItemsByType(params['prodType']).subscribe(res => {
            this.loadingComplete = true;
            this.typeAndItemsArr = res;
            if (res.products.length <= 12) {
              this.pages.push(res.products);
            } else {
              this.pages.push(res.products.splice(0, STEP));
              while (res.products.length > STEP - 2) {
                this.pages.push(res.products.splice(0, STEP));
              }
            }

            setTimeout(function () {
              this.mySiema = new Siema();
              document.querySelector('.prev').addEventListener('click', () => this.mySiema.prev());
              document.querySelector('.next').addEventListener('click', () => this.mySiema.next());
            }, 10);
            console.log(this.pages);
          })
        } else if (params['col']) {
          this.isCollectionPage = true;
          this.pageTypeDefine = true;
          this.mainService.getCollectionAndCollectionItemsById({
            offset: OFFSET,
            limit: 0
          }, params['col']).subscribe(res => {
            this.loadingComplete = true;
            this.collection = res;
            if (res.collectionItems.length <= 12) {
              this.pages.push(res.collectionItems);
            } else {
              this.pages.push(res.collectionItems.splice(0, STEP));
              while (res.collectionItems.length > STEP - 2) {
                this.pages.push(res.collectionItems.splice(0, STEP));
              }
              this.pages.push(res.collectionItems);
            }
            setTimeout(function () {
              this.mySiema = new Siema();
              document.querySelector('.prev').addEventListener('click', () => this.mySiema.prev());
              document.querySelector('.next').addEventListener('click', () => this.mySiema.next());
            }, 10);

          });
        }
      }, e => {

      },
      () => {

      });
  }

  updateVars() {
    this.pages = [];
    this.loadingComplete = false;
    this.showAllMode = false;
  }

  ngAfterViewInit() {
    this.loadingComplete = false;
  }

  ngOnDestroy() {
    this.loadingComplete = false;
  }

  ngOnChanges() {
    this.loadingComplete = false;
  }

  showAllProducts() {
    this.showAllMode = !this.showAllMode;
    /*if(!this.showAllMode){
      this.mySiema = new Siema();
      document.querySelector('.prev').addEventListener('click', () => this.mySiema.prev());
      document.querySelector('.next').addEventListener('click', () => this.mySiema.next());
    }*/
    console.log(this.showAllMode);
  }

}
