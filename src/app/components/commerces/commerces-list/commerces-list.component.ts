import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Commerce } from 'src/app/common/commerce';
import { CommerceService } from 'src/app/services/commerce.service';
import { Ville } from 'src/app/common/ville';
import { VilleService } from 'src/app/services/ville.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commerces-list',
  templateUrl: './commerces-list.component.html',
  styleUrls: ['./commerces-list.component.css']
})
export class CommercesListComponent implements OnInit  {

  villes!: Ville[];
  dataSourceCommerce: MatTableDataSource<Commerce>;
  displayedColumnsCommerce: string[] = ['id', 'commerceName', 'proprietaireName', 'adresse', 'telephone', 'action'];
  @ViewChild('TableCommercePaginator', { static: true }) tableCommercePaginator!: MatPaginator;
  @ViewChild('TableCommerceSort', { static: true }) tableCommerceSort!: MatSort;

  static villeId: number = 1;

  constructor(
    private commerceService: CommerceService,
    private router: Router,
    private villeService : VilleService,
    private categoryService : CategoryService) {
    this.dataSourceCommerce = new MatTableDataSource<Commerce>();
  }

  ngOnInit(): void{
    this.listVilles();

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

  deleteCommerce(index: number, e: any){
    if(window.confirm('Are you sure')) {
      const data = this.dataSourceCommerce.data;
      data.splice((this.tableCommercePaginator.pageIndex * this.tableCommercePaginator.pageSize) + index, 1);
      this.dataSourceCommerce.data = data;
      this.commerceService.deleteCommerces(e.id).subscribe();
      this.router.navigate(['/commerces-list']);
    }
  }

  onRowClicked(row: Commerce) {
    console.log(row.id);
  }

  applyFilterOne1(filterValue: string) {
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

}
