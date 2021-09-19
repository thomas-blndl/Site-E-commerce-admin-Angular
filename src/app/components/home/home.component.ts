import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Response} from "../../models/response";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: any | undefined;
  productSub: any | undefined;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productSub = this.productsService.getProducts().subscribe(
      (response: Response)=>{
        this.products = response.result;
      },
      (error => {
        console.log(error);
      })
    );
  }

}
