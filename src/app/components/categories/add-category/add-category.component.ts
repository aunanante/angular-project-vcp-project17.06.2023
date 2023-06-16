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

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})

export class AddCategoryComponent implements OnInit {

  villes!: Ville[];

  dataSourceCommerce!: MatTableDataSource<Commerce>;
  displayedColumnsCommerce: string[] = ['id', 'commerceName', 'proprietaireName', 'adresse', 'telephone'];
  @ViewChild('TableCommercePaginator', { static: true }) tableCommercePaginator!: MatPaginator;
  @ViewChild('TableCommerceSort', { static: true }) tableCommerceSort!: MatSort;
  static villeId: Number = 1;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  categoryForm = this.fb.group({
    categoryName: ['', [Validators.required]],
    commerce_id: 1
  })

  constructor(public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private categoryService: CategoryService,
    private commerceService: CommerceService,
    private villeService: VilleService) {
    this.dataSourceCommerce = new MatTableDataSource<Commerce>();
  }

  ngOnInit(): void {
    this.listVilles();
    //this.listCommerces(1);
    this.categoryForm.disable();
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

  applyFilterOne1(filterValue: string) {
    this.categoryForm.disable();
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
    
    console.log(row.id);
    this.categoryForm.patchValue({
      commerce_id: row.id
    });
    this.categoryForm.enable();
  }

  submitCategoryForm() {
    console.log(this.categoryForm.value)
    if (this.categoryForm.valid) {
      if (window.confirm('Are you sure?')) {
        this.categoryService.createCategory (this.categoryForm.value).subscribe((response) => {
          this.categoryForm.reset();
          // Redirect the user to the app
          this.router.navigate(['/categories-list']);
          // this.ngZone.run(() => this.router.navigateByUrl('/categories-list'))
        });
      }
    } else {
      console.log("category form non valide");
    }
    this.categoryForm.disable();
  }
  
}
