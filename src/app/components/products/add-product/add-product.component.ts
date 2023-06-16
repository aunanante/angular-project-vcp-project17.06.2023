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
import { ProductService } from 'src/app/services/product.service';
import * as moment from 'moment';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  villes!: Ville[];
  categories!: Category[];

  dataSourceCommerce!: MatTableDataSource<Commerce>;
  displayedColumnsCommerce: string[] = ['id', 'commerceName', 'proprietaireName', 'adresse', 'telephone'];
  @ViewChild('TableCommercePaginator', { static: true }) tableCommercePaginator!: MatPaginator;
  @ViewChild('TableCommerceSort', { static: true }) tableCommerceSort!: MatSort;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  @ViewChild('resetProductForm') myNgForm: any;
  @ViewChild('uploadControl') uploadControl!: ElementRef;
  uploadFileName = 'Choose File';

  productForm = this.fb.group({
    active: ['', [Validators.required]],
    //active: [true],
    dateCreated: ['', [Validators.required]],
    description: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    lastUpdate: ['', [Validators.required]],
    name: ['', [Validators.required]],
    sku: ['', [Validators.required]],
    unitPrice: ['', [Validators.required]],
    unitsInStock: ['', [Validators.required]],
    productCategory_id: 1

  })

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private categoryService: CategoryService,
    private commerceService: CommerceService,
    private productService: ProductService,
    private villeService: VilleService) {
    this.dataSourceCommerce = new MatTableDataSource<Commerce>();
  }

  ngOnInit(): void {
    this.listVilles();
    this.productForm.disable();
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

  submitProductForm() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (productData.dateCreated) {
        productData.dateCreated = moment(productData.dateCreated, 'MM/DD/YYYY').format('YYYY-MM-DD');
      }

      if (productData.lastUpdate) {
        productData.lastUpdate = moment(productData.lastUpdate, 'MM/DD/YYYY').format('YYYY-MM-DD');
      }

      if (window.confirm('Are you sure?')) {
        
        this.productService.createProduct(productData).subscribe((response) => {
          console.log(" the response is : " + response);
          this.productForm.reset();
           // Redirect the user to the app
           this.router.navigate(['/products-list']);
        })
      }
    } else {
      console.log('this.productForm.value non valide');
    }
    this.productForm.disable();
  }

  listCommerces(arg0: number) {
    this.commerceService.getCommerceByVilleId(arg0).subscribe(
      data => {

        this.dataSourceCommerce.data = data as Commerce[];

      }
    );
  }

  listAllCommerces() {
    this.commerceService.getAllCommerces().subscribe(
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

  applyFilterOne1(filterValue: string) {
    CommercesListComponent.villeId = +filterValue;
    console.log('villeId = ', +filterValue);
    this.listCommerces(+filterValue);
    //this.dataSourceCommerce.filter = filterValue.trim().toLowerCase();    
  }

  applyFilterOne2(filterValue: string) {
    //CommercesListComponent.villeId = +filterValue;
    console.log('categoryId = ', +filterValue);
    this.productForm.patchValue({
      productCategory_id: +filterValue
    });
    this.productForm.enable();
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

    console.log(row.id);
    this.listCategoriesByCommerceId(row.id);

  }

  onFileChange(e: any) {

    if (e.target.files && e.target.files[0]) {

      this.uploadFileName = '';
      Array.from(e.target.files).forEach((file: any) => {
        this.uploadFileName += file.name;
      });

      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = res => {

          const imgBase64Path = e.target.result;

        };
      };
      fileReader.readAsDataURL(e.target.files[0]);

      this.uploadControl.nativeElement.value = "";
      console.log(this.uploadFileName)
    } else {
      this.uploadFileName = 'Choose File';
    }

  }

  pick_file(): void {

    console.log(this.uploadFileName)

    this.productForm.patchValue({

      imageUrl: 'assets/images/' + this.uploadFileName
    });
  }


}
