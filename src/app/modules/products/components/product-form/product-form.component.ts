import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    amount: [0, Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    amount: [0, Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
  });
  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });
  public saleProductSelected!: GetAllProductsResponse;
  public renderDropdown = false;
  public productAtion!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };
  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> = [];
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private ProductsDtService: ProductsDataTransferService,
    private messageService: MessageService,
    private router: Router,
    private ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.productAtion = this.ref.data;
    this.productAtion?.event?.action === this.saleProductAction &&
      this.getProductDatas();
    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;

            if (
              this.productAtion?.event?.action === this.editProductAction &&
              this.productAtion?.productDatas
            ) {
              this.getProductSelectedDatas(
                this.productAtion?.event?.id as string
              );
            }
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        amount: Number(this.addProductForm.value.amount),
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            });
          },
        });
    }
    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm?.value &&
      this.editProductForm?.valid &&
      this.productAtion.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        amount: this.editProductForm.value.amount as number,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        category_id: this.editProductForm.value.category_id as string,
        product_id: this.productAtion?.event?.id,
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  handleSubmitSaleProduct(): void {
    if (this.saleProductForm.value && this.saleProductForm.valid) {
      const requestDatas: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        product_id: this.saleProductForm.value?.product_id as string,
      };

      this.productsService
        .saleProduct(requestDatas)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Venda efetuada com sucesso!',
                life: 2500,
              });
              this.saleProductForm.reset();
              this.getProductDatas();
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            console.log(err);
            this.saleProductForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao efetuar venda!',
              life: 2500,
            });
          },
        });
    }
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAtion?.productDatas;
    if (allProducts.length > 0) {
      const productsFiltered = allProducts.filter(
        (element) => element?.id === productId
      );
      if (productsFiltered) {
        this.productSelectedDatas = productsFiltered[0];
      }
      this.editProductForm.setValue({
        name: this.productSelectedDatas?.name,
        amount: this.productSelectedDatas?.amount,
        price: this.productSelectedDatas?.price,
        description: this.productSelectedDatas?.description,
        category_id: this.productSelectedDatas?.category?.id,
      });
    }
  }

  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.ProductsDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
