import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Commerce } from 'src/app/common/commerce';
import { CommerceService } from 'src/app/services/commerce.service';
import { Ville } from 'src/app/common/ville';
import { VilleService } from 'src/app/services/ville.service';
import { CommercesListComponent } from '../../commerces/commerces-list/commerces-list.component';
import { Category } from 'src/app/common/category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';

import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent  implements OnInit {

  villes!: Ville[];
  categories!: Category[];
  isMatSelectDisabled = true;

  dataSourceCommerce: MatTableDataSource<Commerce>;
  displayedColumnsCommerce: string[] = ['id', 'commerceName', 'proprietaireName', 'adresse', 'telephone'];
  @ViewChild('TableCommercePaginator', { static: true }) tableCommercePaginator!: MatPaginator;
  @ViewChild('TableCommerceSort', { static: true }) tableCommerceSort!: MatSort;

  dataSourceProduct: MatTableDataSource<Product>;
  displayedColumnsProduct: string[] = ['id','name','description','unitPrice','imageUrl', 'action'];
  @ViewChild('TableProductPaginator', { static: true }) tableProductPaginator!: MatPaginator;
  @ViewChild('TableProductSort', { static: true }) tableProductSort!: MatSort;

  @ViewChild('categorySelect') categorySelect!: MatSelect;

  static categoryId: Number = 1;

  // visible = true;
  // selectable = true;
  // removable = true;
  // addOnBlur = true;

  constructor(
    private categoryService: CategoryService,
    private commerceService: CommerceService,
    private productService: ProductService,
    private villeService: VilleService) {
    this.dataSourceCommerce = new MatTableDataSource<Commerce>();
    this.dataSourceProduct = new MatTableDataSource<Product>();
  }

  ngOnInit(): void{
    this.listVilles();
    
    this.dataSourceCommerce.paginator = this.tableCommercePaginator;
    this.dataSourceCommerce.sort = this.tableCommerceSort;

    this.dataSourceProduct.paginator = this.tableProductPaginator;
    this.dataSourceProduct.sort = this.tableProductSort;
  }

  listProductsByCategoryId(arg0: number) {
    this.dataSourceProduct.data = [];
    this.productService.getProductByCategoryId(arg0).subscribe(
      data => {
        this.dataSourceProduct.data = data as Product[];
      }
    );
  }

  listVilles() {
    this.villeService.getAllVilles().subscribe(
      data => {
        this.villes = data.sort((a, b) => {
          if (a.villeName < b.villeName) {
            return -1;
          } else if (a.villeName > b.villeName) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    )
  }

  listCommerces(arg0: number) {
    this.commerceService.getCommerceByVilleId(arg0).subscribe(
      data => {
        //console.log('Liste des Commerces =' + JSON.stringify(data));
        this.dataSourceCommerce.data = data as Commerce[];
        
      }
    );
  }

  listAllCommerces() {
    this.commerceService.getAllCommerces().subscribe(
      data => {
        //console.log('Liste des Commerces =' + JSON.stringify(data));
        this.dataSourceCommerce.data = data as Commerce[];
        
      }
    );
  }

  listCategoriesByCommerceId(arg0: number) {
    this.categoryService.getCategoryByCommerceId(arg0).subscribe(
      data => {
        //console.log('Liste des Commerces =' + JSON.stringify(data));
        this.categories = data;
        
      }
    );
  }

  applyFilterOne1(filterValue: string) {
    this.isMatSelectDisabled = true;
    this.dataSourceProduct.data = [];
    this.categorySelect.value = null;
    CommercesListComponent.villeId = +filterValue;
    console.log('villeId = ',+filterValue);
    this.listCommerces(+filterValue);
    //this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();    
  }

  applyFilterOne(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();
    this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCommerce.paginator) {
      this.dataSourceCommerce.paginator.firstPage();
    }
  }

  onRowClicked(row: Commerce) {
    this.isMatSelectDisabled = true;
    this.isMatSelectDisabled = false;
    console.log(row.id);
    this.listCategoriesByCommerceId(row.id);  
    
  }

  applyFilterOne2(filterValue: string) {
    // ProductsListComponent.categoryId = +filterValue;
    console.log('la catégorie en cours est : categoryId = ', +filterValue);
    this.listProductsByCategoryId(+filterValue);
    
  }

  deleteProduct(index: number, e: any){
    if(window.confirm('Are you sure')) {
      const data = this.dataSourceProduct.data;
      data.splice((this.tableProductPaginator.pageIndex * this.tableProductPaginator.pageSize) + index, 1);
      this.dataSourceProduct.data = data;
      this.productService.deleteProduct(e.id).subscribe()
      
    }
  }

  compareFn(option1: any, option2: any): boolean {
    return option1 && option2 ? option1.id === option2.id : option1 === option2;
  }

}
