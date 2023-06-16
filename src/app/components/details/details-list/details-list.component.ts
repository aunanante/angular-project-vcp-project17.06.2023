import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { DetailService } from 'src/app/services/detail.service';
import { Detail } from 'src/app/common/detail';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.component.html',
  styleUrls: ['./details-list.component.css']
})
export class DetailsListComponent implements OnInit {

  villes!: Ville[];
  categories!: Category[];
  products!: Product[];
  isMatSelectDisabled = true;

  dataSourceCommerce: MatTableDataSource<Commerce>;
  displayedColumnsCommerce: string[] = ['id', 'commerceName', 'proprietaireName', 'adresse', 'telephone'];
  @ViewChild('TableCommercePaginator', { static: true }) tableCommercePaginator!: MatPaginator;
  @ViewChild('TableCommerceSort', { static: true }) tableCommerceSort!: MatSort;

  dataSourceDetail: MatTableDataSource<Detail>;
  displayedColumnsDetail: string[] = ['id','detailName','imageDetailUrl', 'action'];
  @ViewChild('TableDetailPaginator', { static: true }) tableDetailPaginator!: MatPaginator;
  @ViewChild('TableDetailSort', { static: true }) tableDetailSort!: MatSort;

  @ViewChild('categorySelect') categorySelect!: MatSelect;
  @ViewChild('productSelect') productSelect!: MatSelect;

  static productId: number = 1;

  detailForm = this.fb.group({
    detailName: ['', [Validators.required]],
    imageDetailUrl: ['', [Validators.required]],
    product_id: 1
  })

  constructor(public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private categoryService: CategoryService,
    private commerceService: CommerceService,
    private productService: ProductService,
    private detailService: DetailService,
    private villeService: VilleService) {
    this.dataSourceCommerce = new MatTableDataSource<Commerce>();
    this.dataSourceDetail = new MatTableDataSource<Detail>();
  }

  ngOnInit () {
    this.listVilles();
    this.detailForm.disable();
    this.dataSourceCommerce.paginator = this.tableCommercePaginator;
    this.dataSourceCommerce.sort = this.tableCommerceSort;
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

  listAllCommerces() {
    this.commerceService.getAllCommerces().subscribe(
      data => {
        this.dataSourceCommerce.data = data as Commerce[];

      }
    );
  }

  listCommerces(arg0: number) {
    this.commerceService.getCommerceByVilleId(arg0).subscribe(
      data => {
        this.dataSourceCommerce.data = data as Commerce[];

      }
    );
  }

  listDetailsByProductId(arg0: number) {
    this.dataSourceDetail.data = []
    this.detailService.getDetailByProductId(arg0).subscribe(
      data => {
        this.dataSourceDetail.data = data as Detail[];
      }
    );
  }

  listCategoriesByCommerceId(arg0: number) {
    this.categoryService.getCategoryByCommerceId(arg0).subscribe(
      data => {
        this.categories = data;

      }
    );
  }

  listProductsByCategoryId(arg0: number) {
    this.productService.getProductByCategoryId(arg0).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  applyFilterOne3(filterValue: string) {
    DetailsListComponent.productId = +filterValue;
    console.log('productId = ',+filterValue);
    this.listDetailsByProductId(+filterValue);
  }

  applyFilterOne2(filterValue: string) {
    //CommercesListComponent.villeId = +filterValue;
    console.log('categoryId = ', +filterValue);
    this.listProductsByCategoryId(+filterValue); 
    this.listDetailsByProductId(0);
    this.detailForm.enable();
  }

  applyFilterOne(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();
    this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCommerce.paginator) {
      this.dataSourceCommerce.paginator.firstPage();
    }
  }

  applyFilterOne1(filterValue: string) {
    this.isMatSelectDisabled = true;
    this.dataSourceDetail.data = [];
    this.categorySelect.value = null;
    // this.productSelect.value = null;
    CommercesListComponent.villeId = +filterValue;
    console.log('villeId = ', +filterValue);
    this.listCommerces(+filterValue);
    //this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();    
  }

  onRowClicked(row: Commerce) {
    this.isMatSelectDisabled = true;
    this.isMatSelectDisabled = false;
    console.log(row.id);
    this.listCategoriesByCommerceId(row.id);
  }

  deleteDetail(index: number, e: any){
    if(window.confirm('Are you sure')) {
      const data = this.dataSourceDetail.data;
      data.splice((this.tableDetailPaginator.pageIndex * this.tableDetailPaginator.pageSize) + index, 1);
      this.dataSourceDetail.data = data;
      this.detailService.deleteDetail(e.id).subscribe()
      
    }
  }
  
}
