import { Component, OnInit } from '@angular/core';
import {Collection, ProductType} from "../../interfaces";
import {ProductsService} from "../../services/products.service";
import LazyLoad from "vanilla-lazyload";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

  ProdTypes: ProductType[] = [];
  collections: Collection[];

  isClosed = false;
  constructor(private mainService: ProductsService) {
  }

  ngOnInit() {
    var myLazyLoad = new LazyLoad({
      elements_selector: ".lazy"
    });
    this.collections = [];
    this.mainService.getAllCollections({}).subscribe(
      col => {
        this.collections = col;
      },
      er => {
        console.log(er);
      });
    this.mainService.getTypesList().subscribe(types => {
      this.ProdTypes = types;
    }, er=>{
      console.log(er);
    });
  }

  getCorrectTypeName(tn: string) {
    let newName = tn;
    let firstChar = newName.split('').splice(0, 1).join('').toUpperCase();
    newName = newName.split('').splice(1, newName.split('').length - 1).join('');
    return firstChar + newName;
  }

  getCorrectCollectionName(cn: string) {
    let newName = cn;
    newName = newName.replace('Коллекция ', '');
    return newName;
  }

  closeCollectionMenu(event: any){
    /*this.isClosed = true;
    let parent = event.target.parentElement;
    let parentParent = parent.parentElement;
    let PPP = parentParent.querySelector('div');
    parent.classList.remove('w--open');
    PPP.classList.remove('w--open');
    parentParent..style='';
    PPP.click();
    parentParent.click();*/
  }

}
