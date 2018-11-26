import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ProductsService} from "../shared/services/products.service";
import {Collection, ProductType} from "../shared/interfaces";
import LazyLoad from "vanilla-lazyload";
import {Meta, Title} from "@angular/platform-browser";
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  collections: Collection[];
  mainCollection: Collection;
  mColLoaded = false;
  constructor(private mainService: ProductsService, private meta: Meta, private title: Title) {
  }

  ngOnInit() {
    this.title.setTitle('Vitkov Pantry - Handmade продукция');
    this.meta.addTag({name: 'description', content: 'Коллекции сувенирной продукции «PANTRY VITKOV», созданные в сотрудничестве с российскими художниками.\n' +
        'В ассортименте: наборы подставок под посуду, подставки под чашки и бокалы из картона и пробкового полотна, блокноты, скетчбуки.\n' +
        'Продукция изготавливается на собственном производстве, которое находится в Московской области.\n' +
        'Качество продукции соответствует аналогам европейского производства.'});
    var myLazyLoad = new LazyLoad({
      elements_selector: ".lazy"
    });
    this.collections = [];
    this.mainService.getAllCollections({limit: 1}).subscribe(col => {
      this.mainCollection = col[0];
      this.mColLoaded = true;
    });
    this.mainService.getAllCollections({limit:2, offset: 0}).subscribe(
      col => {
        this.collections = col;
      },
      er => {
        console.log(er);
      });
  }
  limitText(text : string){
    return text.split('').splice(0, 250).join('')+'...';
  }

}
