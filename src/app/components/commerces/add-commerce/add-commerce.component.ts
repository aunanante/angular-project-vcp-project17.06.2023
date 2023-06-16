import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Ville } from 'src/app/common/ville';
import { Commerce } from 'src/app/common/commerce';
import { VilleService } from 'src/app/services/ville.service';
import { CommerceService } from 'src/app/services/commerce.service';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';

@Component({
  selector: 'app-add-commerce',
  templateUrl: './add-commerce.component.html',
  styleUrls: ['./add-commerce.component.css']
})
export class AddCommerceComponent implements OnInit {

  delay = 20;
  villes!: Ville[];
  //selectedVilleId!: number;
  defaultDate = new Date();
  visible = true;


  commerceForm = this.fb.group({
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

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private villeService: VilleService,
    private commerceService: CommerceService
  ) { }

  ngOnInit(): void {
    this.listVilles();
    this.commerceForm.controls['presentation'].setValue('individuelle');
    this.commerceForm.controls['type_transfert'].setValue('orange');
    this.commerceForm.disable();
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

  applyFilterOne1(filterValue: number) {
    this.commerceForm.enable();
    console.log(filterValue);
    //this.commerceForm.controls[].setValue(+filterValue);
    this.commerceForm.patchValue({
      ville_id: filterValue
    });
  }

  submitCommerceForm(): void {
    console.log("saisie valide " + this.commerceForm.valid)
    console.log(this.commerceForm.value);

    if (this.commerceForm.valid) {

      const commerceData = this.commerceForm.value;
      if (commerceData.date_transfert) {
        commerceData.date_transfert = moment(commerceData.date_transfert, 'MM/DD/YYYY').format('YYYY-MM-DD');
      }
      if (commerceData.date_peremption) {
        commerceData.date_peremption = moment(commerceData.date_peremption, 'MM/DD/YYYY').format('YYYY-MM-DD');
      }

      if (window.confirm('Are you sure?')) {
        this.commerceService.createCommerce(commerceData).subscribe((response) => {
          console.log(" the response is : " + response);
          this.commerceForm.reset();
          // Redirect the user to the app
          this.router.navigate(['/commerces-list']);
        });
      }
    } else {
      console.log("commerce form non valide");
    }
  }

  calculateValues() {
    // check the fields required to make the calculations to avoid NaN errors
    if (this.commerceForm.value.date_transfert) {
      // patch the values on the form
      let date: Date = new Date(this.commerceForm.value.date_transfert);
      this.commerceForm.patchValue({
        //date_peremption: this.addDays(date, this.delay).toDateString(),
        date_peremption: this.formattage(this.addDays(date, this.delay)).toString() ,
        payed: true
      });
    }
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  formattage(inputDate: { getDate: () => any; getMonth: () => number; getFullYear: () => any; }) {
    let date, month, year;
  
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
  
      date = date
          .toString()
          .padStart(2, '0');
  
      month = month
          .toString()
          .padStart(2, '0');
  
    //return `${date}/${month}/${year}`;
    return `${month}/${date}/${year}`;
  }


}
