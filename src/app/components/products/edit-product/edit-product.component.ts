import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductsListComponent } from '../products-list/products-list.component';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productForm!: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.productService.getProductById(+id!).subscribe(data => {
      this.productForm = this.fb.group({
        sku: [data.sku, [Validators.required]],
        name: [data.name, [Validators.required]],
        description: [data.description, [Validators.required]],
        unitPrice: [data.unitPrice, [Validators.required]],
        imageUrl: [data.imageUrl, [Validators.required]],
        active: [data.active, [Validators.required]],
        unitsInStock: [data.unitsInStock, [Validators.required]],
        dateCreated: [data.dateCreated, [Validators.required]],
        lastUpdate: [data.lastUpdate, [Validators.required]],
        productCategory_id: [data.productCategory_id]
      })
    });
  }

  ngOnInit(): void {
    this.updateProductBookForm();
  }

  updateProductBookForm() {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      active: ['', [Validators.required]],
      unitsInStock: ['', [Validators.required]],
      dateCreated: ['', [Validators.required]],
      lastUpdate: ['', [Validators.required]],
      productCategory_id: 1
    })
  }

  updateProductForm() {
    if (!this.productForm.valid) {
      return false;
    } else {
      var id = this.actRoute.snapshot.paramMap.get('id');
      if (id) {
        if (window.confirm('Are you sure you want to update?')) {
          this.productService.updateProduct(+id, this.productForm.value).subscribe({
            complete: () => {
              this.router.navigate(['/products-list']);
              console.log('Content updated successfully!');
            },
            error: (e) => {
              console.log(e);
            }
          })
        }
      }
      return "totot"
    }
  }


}
