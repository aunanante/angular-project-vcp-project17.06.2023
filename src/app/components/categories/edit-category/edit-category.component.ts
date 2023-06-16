import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CategoriesListComponent } from '../categories-list/categories-list.component';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})

export class EditCategoryComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  commerceId = CategoriesListComponent.commerceId;

  @ViewChild('resetCategoryForm') myNgForm: any;

  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.updateCategoryBookForm();
  }

  constructor(public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private categoryService: CategoryService) {
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.categoryService.getCategoryById(+id!).subscribe(data => {
      this.categoryForm = this.fb.group({
        categoryName: [data.categoryName, [Validators.required]],
        commerce_id: [data.commerce_id]
      })
    });
  }



  updateCategoryBookForm() {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      commerce_id: 1

    })
  }

  updateCategoryForm() {
    if (!this.categoryForm.valid) {
      return false;
    } else {
      var id = this.actRoute.snapshot.paramMap.get('id');
      if (window.confirm('Are you sure you want to update?')) {
        this.categoryService.updateCategory(+id!, this.categoryForm.value).subscribe({
          complete: () => {
            this.router.navigate(['/categories-list']);
            console.log('Content updated successfully!');
          },
          error: (e) => {
            console.log(e);
          }
        });
      }
      return "totot";
    }


  }
  
}
