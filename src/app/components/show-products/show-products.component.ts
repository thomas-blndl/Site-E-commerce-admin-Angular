import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ProductsService} from "../../services/products.service";
import {FileUploadService} from "../../services/file-upload.service";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css']
})
export class ShowProductsComponent implements OnInit {

  @Input() products: Product[] | any;
  productModalOpen: boolean = false;
  selectedProduct: Product | any;
  file: File | any;
  progress:number = 0;
  baseUrlImage = environment.api_image;
  delete: boolean = false;
  ProductToBeDeleted: Product | any;

  constructor(private productService: ProductsService, private fileService: FileUploadService) {
  }

  ngOnInit(): void {
  }

  onEdit(product: Product) {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  onDelete(product: Product) {
    this.delete = true;
    this.ProductToBeDeleted = product;
  }

  addProduct() {
    this.selectedProduct = undefined;
    this.productModalOpen = true;
  }

  handleFinish(event: any) {
    let product = event.product ? event.product : null;
    this.file = event.file ? event.file : null;
    if (product) {
      if (this.selectedProduct) {
        //Edit product
        product.idProduct = this.selectedProduct.idProduct;
        this.editProductToServer(product);
      } else {
        //Add product
        this.addProductToServer(product);
      }
    }
    this.productModalOpen = false;

  }

  handelCancelDelete() {
    this.delete = false;
  }

  handleConfirmDelete() {

    this.productService.deleteProduct(this.ProductToBeDeleted).subscribe(
      // @ts-ignore
      (data: Response)=>{
        if (data.status == 200){

          //Delete image
          this.fileService.deleteImage(this.ProductToBeDeleted.image)
          console.log(data);

          //update frontend
          // @ts-ignore
          const index = this.products.findIndex(p => p.idProduct == this.ProductToBeDeleted.idProduct);
          this.products.splice(index, 1);
        } else {
          console.log(data.statusText);
        }
      }
    );
    this.handelCancelDelete();
  }

  uploadImage(event: HttpEvent<any>){

    return new Promise(
      (resolve, reject) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log("requete envoyée");
            break;
          case HttpEventType.UploadProgress:
            // @ts-ignore
            this.progress = Math.round(event.loaded / event.total * 100);
            if(this.progress == 100){
              resolve(true);
            }
            break;
          case HttpEventType.Response:
            console.log(event.body);
            setTimeout(()=>{
              this.progress = 0;
            }, 1500);
        }
      }
    )
  }

  addProductToServer(product: Product) {
    this.productService.addProduct(product).subscribe(
      (data) => {
        if (data.status == 200) { //200 == response valid
          if (this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>)=>{
                this.uploadImage(event).then(
                  ()=>{
                    product.idProduct = data.args.lastInsertId;
                    this.products.push(product);
                  }
                );
              }
            )
          }
          product.idProduct = data.args.lastInsertId;
          this.products.push(product);
        }
      }
    );
  }

  editProductToServer(product: Product) {
    this.productService.editProduct(product).subscribe(
      // @ts-ignore
      (data: Response)=>{
        if(data.status == 200){
          if (this.file){
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>)=>{
                this.uploadImage(event).then(
                  ()=>{
                    this.updateProduct(product);
                  }
                );
              }
            );
            this.fileService.deleteImage(product.oldImage).subscribe(
              (data: Response)=>{
                console.log(data);
              }
            );
          } else {
            this.updateProduct(product);
          }

        } else {
          console.log(data.statusText);
        }
      }
    )
  }

  updateProduct(product: Product){
    // @ts-ignore
    const index = this.products.findIndex(p => p.idProduct == product.idProduct);
    this.products = [
      ...this.products.slice(0,index),
      product,
      ...this.products.slice(index+1)
    ]
  }

}
