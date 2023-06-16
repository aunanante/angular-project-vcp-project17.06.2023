import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { CommerceService } from 'src/app/services/commerce.service';
import { CommercesListComponent } from '../commerces-list/commerces-list.component';

@Component({
  selector: 'app-edit-commerce',
  templateUrl: './edit-commerce.component.html',
  styleUrls: ['./edit-commerce.component.css']
})
export class EditCommerceComponent  implements OnInit{



  delay = 20;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  submitted = false;

  villeId = CommercesListComponent.villeId;
  commerceForm!: FormGroup;

  ngOnInit(): void {
    this.updateCommerceBookForm();
  }

  constructor(public fb: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute,
    private commerceService: CommerceService) {

    var id = this.actRoute.snapshot.paramMap.get('id');
    // console.log('commerceId = ', id);
    // console.log('villeId = ', this.villeId);

    this.commerceService.getCommerceById(+id!).subscribe(data => {
      this.commerceForm = this.fb.group({
        commerceName: [data.commerceName, [Validators.required]],
        proprietaireName: [data.proprietaireName, [Validators.required]],
        adresse: [data.adresse, [Validators.required]],
        telephone: [data.telephone, [Validators.required]],
        email: [data.email, [Validators.required]],

        transfert: [data.transfert, [Validators.required]],
        date_transfert: [data.date_transfert, [Validators.required]],
        type_transfert: [data.type_transfert, [Validators.required]],
        payed: [data.payed, [Validators.required]],
        date_peremption: [data.date_peremption, [Validators.required]],
        presentation: [data.presentation, [Validators.required]],
        ville_id: [data.ville_id]
      })
    });
  }

  updateCommerceBookForm() {
    this.commerceForm = this.fb.group({
      commerceName: ['', [Validators.required]],
      proprietaireName: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],


      transfert: ['', [Validators.required]],
      date_transfert: ['', [Validators.required]],
      type_transfert: ['', [Validators.required]],
      payed: [false, [Validators.required]],
      date_peremption: ['', [Validators.required]],
      presentation: ['', [Validators.required]],

      ville_id: 1
    })
  }

  updateCommerceForm() {
    /* this.commerceForm.patchValue({
      ville_id: this.villeId
    }) */

    this.submitted = true;

    if (!this.commerceForm.valid) {
      return false;
    } else {

      console.log(this.commerceForm.value);
      var id = this.actRoute.snapshot.paramMap.get('id');
      if (window.confirm('Are you sure you want to update?')) {
        this.commerceService.updateCommerce(+id!, this.commerceForm.value).subscribe({
          complete: () => {
            //this.ngZone.run(() => this.router.navigateByUrl('/commerces-list'))
            this.router.navigate(['/commerces-list']);
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

  calculateValues() {
    // check the fields required to make the calculations to avoid NaN errors
    if (this.commerceForm.value.date_transfert) {
      // patch the values on the form
      let date: Date = new Date(this.commerceForm.value.date_transfert);
      this.commerceForm.patchValue({
        date_peremption: this.addDays(date, this.delay).toDateString(),
        payed: true
      });
    }

  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

}
