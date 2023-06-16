import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailService } from 'src/app/services/detail.service';
import { DetailsListComponent } from '../details-list/details-list.component';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.component.html',
  styleUrls: ['./edit-detail.component.css']
})
export class EditDetailComponent implements OnInit {

  detailForm!: FormGroup;
  // @ViewChild('resetDetailForm') myNgForm: any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private detailService: DetailService
  ) {
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.detailService.getDetailById(+id!).subscribe(data => {
      this.detailForm = this.fb.group({
        detailName: [data.detailName, [Validators.required]],
        imageDetailUrl: [data.imageDetailUrl, [Validators.required]],
        product_id: [data.product_id]
      })
    });
  }

  ngOnInit(): void {
    this.updateDetailForm();
  }

  updateDetailForm() {
    this.detailForm = this.fb.group({
      detailName: ['', [Validators.required]],
      imageDetailUrl: ['', [Validators.required]],
      product_id: 1
    })
  }

  updateMyDetailsForm() {
    if (!this.detailForm.valid) {
      return false
    } else {
      var id = this.actRoute.snapshot.paramMap.get('id');
      if (id) {
        this.detailService.updateDetail(+id, this.detailForm.value).subscribe({
          complete: () => {
            this.router.navigate(['/details-list']);
            console.log('Content updated successfully!');
          },
          error: (e) => {
            console.log(e);
          }
        })
      }
      return "totot"
    }
  }


}
