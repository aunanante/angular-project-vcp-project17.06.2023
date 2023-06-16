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

@Component({
  selector: 'app-add-detail',
  templateUrl: './add-detail.component.html',
  styleUrls: ['./add-detail.component.css']
})
export class AddDetailComponent implements OnInit  {

  villes!: Ville[];
  categories!: Category[];
  products!: Product[];

  dataSourceCommerce: MatTableDataSource<Commerce>;
  displayedColumnsCommerce: string[] = ['id', 'commerceName', 'proprietaireName', 'adresse', 'telephone'];
  @ViewChild('TableCommercePaginator', { static: true }) tableCommercePaginator!: MatPaginator;
  @ViewChild('TableCommerceSort', { static: true }) tableCommerceSort!: MatSort;

  //static villeId: Number = 1;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  @ViewChild('resetdetailForm') myNgForm: any;
  @ViewChild('uploadControl') uploadControl!: ElementRef;
  uploadFileName = 'Choose File';

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

  listCommerces(arg0: number) {
    this.commerceService.getCommerceByVilleId(arg0).subscribe(
      data => {
        this.dataSourceCommerce.data = data as Commerce[];
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

  submitdetailForm() {
    console.log(this.detailForm.value)
    if (this.detailForm.valid) {
      this.detailService.createDetail(this.detailForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/details-list'))
      });
    } else {
      console.log('this.detailForm.value non valide')
    }
    this.detailForm.disable();
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
    CommercesListComponent.villeId = +filterValue;
    console.log('villeId = ', +filterValue);
    this.listCommerces(+filterValue);
  }

  applyFilterOne2(filterValue: string) {
    //CommercesListComponent.villeId = +filterValue;
    console.log('categoryId = ', +filterValue);
    this.listProductsByCategoryId(+filterValue); 
    /* this.detailForm.patchValue({
      category: {
        id: +filterValue
      }
    });
    this.detailForm.enable(); */
  }

  applyFilterOne3(filterValue: string) {
    //CommercesListComponent.villeId = +filterValue;
    console.log('productId = ', +filterValue);
    this.detailForm.patchValue({
      product_id : +filterValue
      /* product: {
        id: +filterValue
      } */
    });
    this.detailForm.enable();
  }

  onRowClicked(row: Commerce) {
    console.log(row.id);
    this.listCategoriesByCommerceId(row.id);
  }

  

}
