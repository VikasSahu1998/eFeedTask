import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empdialog',
  templateUrl: './empdialog.component.html',
  styleUrls: ['./empdialog.component.css']
})
export class EmpdialogComponent implements OnInit {

  
  public birthdate!: Date;
  public age!: number;
  
  empform : FormGroup |any;
  button1: string = "Save"
  constructor(private formbuilder: FormBuilder,
    private dialogref: MatDialogRef<EmpdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,private toastr: ToastrService) { }
   
  ngOnInit(): void {
    this.empform = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      genders: new FormControl('', [Validators.required,]),
      date: new FormControl('', [Validators.required,]),
      address: new FormControl('', [Validators.required,]),
      age: new FormControl('', [Validators.required,]),
      pnumber: new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      pincode: new FormControl('', [Validators.required,Validators.pattern('[0-9]{6}')]),
      state: new FormControl('', [Validators.required,]),
      district: new FormControl('', [Validators.required,]),
    });
    if (this.editData) {
      this.button1 = "Update";
      this.empform.controls['lname'].setValue(this.editData.lname);
      this.empform.controls['name'].setValue(this.editData.name);
      this.empform.controls['genders'].setValue(this.editData.genders);
      this.empform.controls['date'].setValue(this.editData.date);
      this.empform.controls['address'].setValue(this.editData.address);
      this.empform.controls['pnumber'].setValue(this.editData.pnumber);
      this.empform.controls['pincode'].setValue(this.editData.pincode);
      this.empform.controls['state'].setValue(this.editData.state);
      this.empform.controls['district'].setValue(this.editData.district);
      this.empform.controls['age'].setValue(this.editData.age);
    }
  }

  public CalculateAge(value: any): void
  {
    if (this.birthdate) {
      //convert date again to type Date
      const bdate = new Date(this.birthdate);
      const timeDiff = Math.abs(Date.now() - bdate.getTime() );
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
 }

  adddetail() {
    if (!this.editData) {
      if (this.empform.valid) {
        this.api.postEmp(this.empform.value)
          .subscribe({
            next: (res) => {
              this.toastr.success('details added successfully', 'successfully', { timeOut: 2000, });
              this.empform.reset();
              this.dialogref.close('save');
            },
            error: () => {
              alert("Something went wrong ")
              this.toastr.error('error while adding  the data', 'error', { timeOut: 2000, });
            }
          })
      }
    } else {
      this.updatedetail();
    }
  }

  updatedetail() {
    this.api.putEmp(this.empform.value, this.editData.id)
      .subscribe({
        next: (res) => {
          this.toastr.success('details updated successfully', 'successfully', { timeOut: 2000, });
          this.empform.reset();
          this.dialogref.close('update');
        },
        error: () => {
          this.toastr.error('error while updating the data', 'error', { timeOut: 2000, });
        }
      })
  }
}