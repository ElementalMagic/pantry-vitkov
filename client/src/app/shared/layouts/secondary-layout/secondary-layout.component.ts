import {Component, OnInit} from '@angular/core';
import {Collection, ProductType} from "../../interfaces";
import {ProductsService} from "../../services/products.service";
import {first} from "rxjs/operators";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-secondary-layout',
  templateUrl: './secondary-layout.component.html',
  styleUrls: ['./secondary-layout.component.css']
})
export class SecondaryLayoutComponent implements OnInit {
  ProdTypes: ProductType[] = [];
  collections: Collection[];
  isCollection = true;
  constructor(private mainService: ProductsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['col'] || params['prodType']){
          this.isCollection = true;
      } else {
        this.isCollection = false;
      }
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
    }, er => {
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
}
