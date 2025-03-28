import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CATEGORIES_ROUTES } from './categories.routing';
import { CategoriesHomeComponent } from './page/categories-home/categories-home.component';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmationService } from 'primeng/api';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

@NgModule({
  declarations: [
    CategoriesHomeComponent,
    CategoriesTableComponent,
    CategoryFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CATEGORIES_ROUTES),
    HttpClientModule,
    SharedModule,
    //PrimeNg
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule,
    //Shared
    SharedModule,
  ],
  providers: [DialogService, ConfirmationService],
})
export class CategoriesModule {}
