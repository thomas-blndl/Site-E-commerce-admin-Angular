import {Component, Input, OnDestroy, OnInit, Output, EventEmitter, OnChanges} from '@angular/core';
import {Product} from "../../models/product";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../services/categories.service";
import {Category} from "../../models/category";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit, OnChanges, OnDestroy {
  // @ts-ignore
  @Input() product: Product;
  @Output() finish = new EventEmitter()
  productForm: FormGroup;
  // @ts-ignore
  categories: Category[];
  // @ts-ignore
  categorySub: Subscription;
  idCategory: number = 1;
  file: File | any;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService) {
    this.productForm = fb.group({
      productInfos: fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required]
      }),
      illustration: fb.group({
        image: ['', Validators.required]
      })
    })
  }

  ngOnInit(): void {
    this.categorySub = this.categoriesService.getCategory().subscribe(
      (response) => {
        this.categories = response.result;
      }
    )
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectCategory(id: number) {
    this.idCategory = id;
  }

  get isProductInfosInvalid(): boolean {
    if (this.productForm.get('productInfos') != null) { // @ts-ignore
      return this.productForm.get('productInfos').invalid;
    }
    return true;
  }

  get isIllustrationInvalid(): boolean {
    if (this.product)
      return false;
    if (this.productForm.get('illustration') != null) { // @ts-ignore
      return this.productForm.get('illustration').invalid;
    }
    return true;
  }

  handleCancel() {
    this.finish.emit();
    this.close()
  }

  handleFinish() {
    const product = {
      ...this.productForm.get('productInfos')?.value,
      ...this.productForm.get('illustration')?.value,
      category: this.idCategory,
      oldImage: null
    }
    if (this.product){
      product.oldImage = this.product.oldImage;
    }

    if (this.file) {
      product.image = this.file.name;
    } else {
      product.image = this.product.oldImage;
    }
    this.finish.emit({product: product, file: this.file ? this.file : null});
    this.close();
  }

  close() {
    this.productForm.reset();
    this.idCategory = 1;

  }

  detectFiles(event: any) {
    this.file = event.target.files[0];
  }

  updateForm(product: Product) {
    this.productForm.patchValue({
      productInfos: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
    });
    product.oldImage = product.image;
    this.selectCategory(product.Category);
  }

  ngOnChanges(): void {
    if(this.product){
      this.updateForm(this.product);
    }
  }
}
