import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: [],
})
export class ProductsTableComponent {
  @Input() public products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const productEventData = id && id !== '' ? { action, id } : { action };
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(productName: string, product_id: string): void {
    if (productName !== '' && product_id !== '') {
      this.deleteProductEvent.emit({ productName, product_id });
    }
  }
}
