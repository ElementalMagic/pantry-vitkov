import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../shared/services/products.service";
import {Collection, Item, ProductType} from "../shared/interfaces";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  prodTypesList: ProductType[] = [];
  prodTypeModelName = '';
  prodTypeModelMultiname = '';
  prodTypeSelectedId = '';
  productSaving = false;
  collectionList: Collection[] = [];
  newProdutct = {
    _id: '',
    barcode: '',
    collectionId: '',
    cost: '',
    equipment: '',
    imgSrc: '',
    marketUrl: '',
    prodType: '',
    specs: '',
    title: '',
    vendorCode: '',
    weight: ''
  };
  newColName = '';
  newColTitle = '';
  image: File;
  firstLoad  = true;

  logFile = '';

  productList: Item[] = [];

  constructor(private mainService: ProductsService) {
  }

  ngOnInit() {
    this.mainService.getAllCollections({}).subscribe(res => {
      this.collectionList = res;
      this.selectCollectionIdForNewProduct(res[0]._id);
    });

    this.mainService.getTypesList().subscribe(res => {
      this.prodTypesList = res;
      this.selectProdType(res[0]._id);
    });
  }

  addNewCollection() {
    let sub = this.mainService.createCollection({name: this.newColName, title: this.newColTitle}).subscribe(res => {
      this.lg('Новая коллекция успешно добавлена!');
      this.lg(JSON.stringify(res));
      console.log(res);
      this.collectionList.push(res);
      sub.unsubscribe();
    })
  }

  selectCollectionIdForNewProduct(id: string) {
    console.log(id);
    // @ts-ignore
    this.newProdutct.collectionId = id;
    this.mainService.getCollectionAndCollectionItemsById({}, id).subscribe(res => {
      if(res.collectionItems.length > 0) {
        this.productList = res.collectionItems;
        // @ts-ignore

      } else {
        this.productList = [];
        if(this.firstLoad) this.newProdutct = {
          _id: '',
          barcode: '',
          collectionId: '',
          cost: '',
          equipment: '',
          imgSrc: '',
          marketUrl: '',
          prodType: '',
          specs: '',
          title: '',
          vendorCode: '',
          weight: ''
        };
        this.newProdutct.collectionId = id;
      }
      this.firstLoad = false;
    })

  }

  selectProduct(id){
    if(id) {
      // @ts-ignore
      this.newProdutct = this.productList.find(p => {
        return p._id === id;
      });
    } else {
      this.newProdutct._id = '';
    }
  }

  selectProdType(id: string) {
    this.prodTypeSelectedId = id;
    this.prodTypeModelName = this.prodTypesList.find(p => {
      return p._id === id;
    }).name;
    this.prodTypeModelMultiname = this.prodTypesList.find(p => {
      return p._id === id;
    }).multiName;
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    this.lg('Изображение выбрано.');
    console.log("Файл изменен");
  }

  addNewProduct() {
    // @ts-ignore
    console.log(this.newProdutct);
    if (this.image && this.newProdutct.title != '') {
      // @ts-ignore
      this.mainService.createItem(this.newProdutct, this.image).subscribe(res => {
        this.lg('Продукт создан!');
        this.lg(JSON.stringify(res));
        console.log(res);
      });
    }
  }

  updateProduct(){
    console.log(this.newProdutct);
    this.mainService.updateItem(this.newProdutct._id, this.newProdutct, this.image).subscribe(res => {
      this.lg('Продукт обновлен!');
      this.lg(JSON.stringify(res));
      console.log(res);
    })
  }

  updateProdType(){
    this.productSaving = true;
    console.log( this.prodTypeModelMultiname);
    this.mainService.patchType(this.prodTypeSelectedId, this.prodTypeModelMultiname).subscribe(res=>{
      this.lg('Тип продукта успешно изменен');
      this.productSaving = false;
    });
  }

  resetNewProd(){
    let colId =  this.newProdutct.collectionId;
    this.newProdutct = {
      _id: '',
      barcode: '',
      collectionId: '',
      cost: '',
      equipment: '',
      imgSrc: '',
      marketUrl: '',
      prodType: '',
      specs: '',
      title: '',
      vendorCode: '',
      weight: ''
    };
    this.newProdutct.collectionId = colId;
  }

  lg(str){
    this.logFile += '\n'+str;
  }
}
