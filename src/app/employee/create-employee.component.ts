import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray,Validators, AbstractControl } from '@angular/forms';
import { CustomValidators } from './../shared/custom.validators';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  // ValidationMessages

  ValidatationMessages = {
    "fullName": {
      "required": "Full name is required",
      "minlength": "Full name must be greater than 2 characters",
      "maxlength": "Full name must be less than 10 chracters"
    },
    "email": {
      "required": "Email is required",
      "emailDomain": "Email domain should be email.com"
    },
    "confirmEmail": {
      "required": "Confirm email is required",
    },
    "emailGroup": {
      "emailMismatch":"Email and Confrim email do not match"
    },
    "phone": {
      "required": "Phone is required"
    },
    "skillName": {
      "required": " Skill name is required"
    },
    "experienceInYears": {
      "required": "Expereince is required"
    },
    "profieciency": {
      "required": "Proficiency is required"
    }
  };

  formErrors = {
    fullName: '',
    email: '',
    skillName: '',
    confirmEmail:'',
    emailGroup:'',
    phone: '',
    experienceInYears: '',
    profieciency: ''
  }

  //FormBuilder is a service so we have to intialize it by injecting in class constructor
  constructor(private fb: FormBuilder,private _activeRoute: ActivatedRoute,private employeeService:EmployeeService) { }

  ngOnInit() {

    // This is using form builder
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.domainCheck('email.com')]],
        confirmEmail:['',Validators.required],
      },{validator: matchEmail}),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    })



    // Observable for specific control in a form

    this.employeeForm.get("contactPreference").valueChanges.subscribe((value: string) => {
      this.onContactPrefrenceChanged(value);
    });




    //Observables for a group

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationError(this.employeeForm)
    });

    // obsevables for specific group inside form group
    this.employeeForm.get('skills').valueChanges.subscribe((value: string) => {
      console.log(value)
    });



    // Subscribe to edit route using paramp method (coming from URL param /edit/:id)
    
    this._activeRoute.paramMap.subscribe(params=>{
      const empId = +params.get("id");
      if(empId){
        this.getEmployee(empId);
      }
    });

    // This is without form builder

    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     profieciency: new FormControl(),
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl()
    //   })
    // });

    


  }

  getEmployee(id:number){
    this.employeeService.getEmployee(id).subscribe((employee:IEmployee)=>{
        this.editEmployee(employee),
        (err:any)=>{
            console.log(err);
        }

    }
    )
  }
 

  // Prepopulating employee from this url edit/employee/1

  editEmployee(employee:IEmployee){
    this.employeeForm.patchValue({
      fullName:employee.fullName,
      contactPreference:employee.contactPreference,
      emailGroup:{
        email:employee.email,
        confirmEmail:employee.confirmEmail       
      },
      phone:employee.phone
      
    })
  }


  addEmployeSkill(): void{
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup())
  }

  // Dynamically add multiple skils

  addSkillFormGroup (): FormGroup{
    return this.fb.group({
      profieciency: ['', Validators.required],
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required]
    });
  }

  onSkillDeleteClick(skillIndex: number) : void{
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillIndex);
  }



  onContactPrefrenceChanged(selectedValue: string): void {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  //logKeyValuePairs
  // FormGroup=this.employeeForm  -- here we are passing default value as this.employeeForm, suppose I call this function as this.logValidationError()..It will still work
  logValidationError(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);


      this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.dirty || abstractControl.touched || abstractControl.value!=='')) {
          const messages = this.ValidatationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + " ";
            }
          }

        }
      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }


      //For form array we have given error in template itself 
      // if (abstractControl instanceof FormArray) {
      //   for(const control of abstractControl.controls){
      //     if (control instanceof FormGroup) {
      //       this.logValidationError(control);
      //     }
      //   }
      // }
    })
  }

  // load data click
  onLoadDataClick(): void {
    // this.logValidationError(this.employeeForm);
    // console.log(this.formErrors);
  }


  onLoadData(): void {
    // this.employeeForm.setValue({
    //   fullName: 'Rohit',
    //   email:"rohit@tcs.com",
    //   skills:{
    //     profieciency: "beginner",
    //     experienceInYears:"4",
    //     skillName:"angular"
    //   }
    // });

   

    this.employeeForm.patchValue({
      fullName: 'Rohit',
      email: "rohit@tcs.com"
      // skills:{
      //   profieciency: "beginner",
      //   experienceInYears:"4",
      //   skillName:"angular"
      // }
    });

  }
  onSubmit(): void {
    console.log(this.employeeForm);
  }
}

function matchEmail(group: AbstractControl): {[key:string]:any}| null{

  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if(emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value==='')){
      return null;
  }else{
    return {'emailMismatch':true};
  }
}