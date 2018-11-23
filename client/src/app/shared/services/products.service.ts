import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Collection, CollectionItems, Item, Message, ProductType} from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  constructor(private http: HttpClient) {
  }

  getCollectionAndCollectionItemsById(params: any = {}, id): Observable<CollectionItems> {
    return this.http.get<CollectionItems>(`/api/collection/${id}`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getAllCollections(params: any = {}): Observable<Collection[]> {
    return this.http.get<Collection[]>(`/api/collection/`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  createCollection(newCollection: Collection): Observable<Collection> {
    const fd = new FormData();


    fd.append('name', newCollection.name);
    fd.append('title', newCollection.title);

    return this.http.post<Collection>('/api/collection', fd);
  }

  updateCollection(id:string, newCollection: Collection): Observable<Collection> {
    const fd = new FormData();


    fd.append('name', newCollection.name);
    fd.append('title', newCollection.title);

    return this.http.patch<Collection>(`/api/collection/${id}`, fd);
  }

  deleteCollection(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/collection/${id}`)
  }

  getItemById(id: string): Observable<Item>{
    return this.http.get<Item>(`/api/production/id/${id}`);
  }

 /* getItemsByType(type:string):Observable<Item[]>{
      return this.http.get<Item[]>(`/api/production/type`,{
        params: new HttpParams({
          fromObject: {prodType: type}
        })
      });
  }*/

  createItem(product: Item, image?: File):Observable<Item>{
    const fd = new FormData();

    if(image){
      fd.append('image', image, image.name);
    }


    fd.append('title', product.title);
    fd.append('prodType', product.prodType);
    fd.append('collectionId', product.collectionId);
    fd.append('vendorCode', product.vendorCode);
    fd.append('barcode', product.barcode);
    fd.append('weight', product.weight);
    fd.append('equipment', product.equipment);
    fd.append('specs', product.specs);
    fd.append('cost', product.cost);
    fd.append('marketUrl', product.marketUrl);

    return this.http.post<Item>('/api/production', fd);
  }

  deleteItem(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/production/${id}`)
  }

  updateItem(id:string, product: Item, image?: File): Observable<Item>{
    const fd = new FormData();

    if(image){
      fd.append('image', image, image.name);
    }

    fd.append('title', product.title);
    fd.append('prodType', product.prodType);
    fd.append('collectionId', product.collectionId);
    fd.append('vendorCode', product.vendorCode);
    fd.append('barcode', product.barcode);
    fd.append('weight', product.weight);
    fd.append('equipment', product.equipment);
    fd.append('specs', product.specs);
    fd.append('cost', product.cost);
    fd.append('marketUrl', product.marketUrl);

    return this.http.patch<Item>(`/api/production/${id}`, fd);
  }

  getTypesList(): Observable<ProductType[]>{
    return this.http.get<ProductType[]>('/api/production/types');
  }

  getItemsByType(type: string, limit?:number, offset?: number):Observable<ProductType>{
    let params = new HttpParams().set('prodType', type);
    if(limit){
      params.set('limit', limit.toString())
    }
    if(offset){
      params.set('offset', offset.toString())
    }
    return this.http.get<ProductType>('/api/production/types', {params: params});
  }

  patchType(id,multiName: string):Observable<ProductType>{
    return this.http.patch<ProductType>(`/api/production/type/${id}`, {multiName: multiName});
  }
}
