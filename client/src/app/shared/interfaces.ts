export interface Item {
  title: string
  prodType: string
  collectionId: string
  vendorCode: string
  barcode: string
  weight: string
  equipment: string
  specs: string
  cost: string
  marketUrl: string
  imgSrc?: string
  date?: Date
  _id?: string
}

export interface Collection {
  name: string
  title: string
  _id?: string
}

export  interface CollectionItems {
  collection: Collection
  collectionItems: Item[]
}

export interface User {
  email: string,
  password: string
}

export interface Message {
  message: string
}

export interface ProductTypeItem {
  id: string
}

export interface ProductType {
  name: string
  multiName: string
  products: ProductTypeItem[]
  _id?: string
}
