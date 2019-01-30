import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {of} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {ProductsService} from "../shared/services/products.service";
import {Collection, CollectionItems, ProductType, ProductTypeItem} from "../shared/interfaces";
import Siema from 'siema/dist/siema.min.js';
import {Meta, Title} from "@angular/platform-browser";


let OFFSET = 0;
const STEP = 12;

@Component({
  selector: 'app-collection-page',
  templateUrl: './collection-page.component.html',
  styleUrls: ['./collection-page.component.css']
})
export class CollectionPageComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input('load') loadingComplete;

  constructor(private route: ActivatedRoute, private mainService: ProductsService, private title: Title, private meta: Meta) {
    this.title.setTitle(`Vitkov Pantry`);
    this.meta.addTag({
      name: 'description',
      content: 'Коллекции сувенирной продукции «PANTRY VITKOV», созданные в сотрудничестве с российскими художниками.\\n\' +\n' +
        '        \'В ассортименте: наборы подставок под посуду, подставки под чашки и бокалы из картона и пробкового полотна, блокноты, скетчбуки.\\n\' +\n' +
        '        \'Продукция изготавливается на собственном производстве, которое находится в Московской области.\\n\' +\n' +
        '        \'Качество продукции соответствует аналогам европейского производства.'
    });
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
            this.typeAndItemsArr = res;
            this.typeAndItemsArr.products.reverse();
            this.title.setTitle(`Vitkov Pantry - товары по типу ${this.typeAndItemsArr.multiName}`);
            this.pages = [];
            if (res.products.length <= 12) {
              this.pages.push(res.products);
            } else {
              this.pages.push(res.products.splice(0, STEP));
              while (res.products.length > STEP - 2) {
                this.pages.push(res.products.splice(0, STEP));
              }
              this.pages.push(res.products);
            }

            // this.pages = temprArr.splice(0, temprArr.length);

            for (let i = 0; i < this.pages.length; i++) {
              for (let j = 0; j < this.pages[i].length; j++) {
                this.mainService.getItemById(this.pages[i][j].id).subscribe(res => {
                  this.pages[i][j] = res;
                });
              }
            }

            this.loadingComplete = true;
            setTimeout(function () {

              this.mySiema = new Siema();
              document.querySelector('.prev').addEventListener('click', () => this.mySiema.prev());
              document.querySelector('.next').addEventListener('click', () => this.mySiema.next());
            }, 10);
          })
        } else if (params['col']) {
          this.isCollectionPage = true;
          this.pageTypeDefine = true;
          this.mainService.getCollectionAndCollectionItemsById({
            offset: OFFSET,
            limit: 0
          }, params['col']).subscribe(res => {
            this.pages = [];
            this.loadingComplete = true;
            this.collection = res;
            this.title.setTitle(`Vitkov Pantry - ${this.collection.collection.name}`);
            this.meta.updateTag({
              name: 'description',
              content: this.collection.collection.title
            }, `name='description'`);


            if (res.collectionItems.length <= 12) {
              this.pages.push(res.collectionItems);
            }
            else {
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

  }

}
