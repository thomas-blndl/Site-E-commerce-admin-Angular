import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css']
})
export class DeleteProductModalComponent implements OnInit {

  @Input() product: Product | any;
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancelDelete() {
    this.cancel.emit();
  }

  confirmDelete() {
    this.confirm.emit();
  }
}
