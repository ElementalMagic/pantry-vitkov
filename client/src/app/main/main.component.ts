import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ProductsService} from "../shared/services/products.service";
import {Collection, ProductType} from "../shared/interfaces";
import LazyLoad from "vanilla-lazyload";
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  collections: Collection[];
  mainCollection: Collection;
  mColLoaded = false;
  constructor(private mainService: ProductsService) {
  }

  ngOnInit() {
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
