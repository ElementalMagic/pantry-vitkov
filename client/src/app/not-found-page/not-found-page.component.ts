import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../shared/services/products.service";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit {

  constructor(private title: Title,private meta: Meta) {
    this.title.setTitle('Page Not Found');
    this.meta.addTag({name:'description', content:'Page not found'});
  }

  ngOnInit() {
  }

}
