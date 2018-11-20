import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../shared/services/products.service";
import {Collection, Item} from "../shared/interfaces";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  collectionList: Collection[] = [];
  newProdutct = {};
  newColName = '';
  newColTitle = '';
  image:File;
  constructor(private mainService: ProductsService) { }

  ngOnInit() {
    this.mainService.getAllCollections({}).subscribe(res=>{
      this.collectionList = res;
    })
  }

  addNewCollection(){
    let sub = this.mainService.createCollection({name: this.newColName, title: this.newColTitle}).subscribe(res=>{
      console.log(res);
      this.collectionList.push(res);
      sub.unsubscribe();
    })
  }
  selectCollectionIdForNewProduct(id: string){
    console.log(id);
    // @ts-ignore
    this.newProdutct.collectionId = id;
  }

  onFileUpload(event: any){
    const file = event.target.files[0];
    this.image = file;

    console.log("Файл изменен");
  }

  addNewProduct(){
    // @ts-ignore
    if(this.image && this.newProdutct.title != ''){
      // @ts-ignore
      this.mainService.createItem(this.newProdutct, this.image).subscribe(res=>{
        console.log(res);
      });
    }
  }
}
