import { AbstractControl } from '@angular/forms';
export class CustomValidators {


// Custom validator function for checking email domain with custom parameter


static domainCheck(domainName:string){
    return (control: AbstractControl): { [key: string]: any } | null=>{
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
  
  
      if (email === '' || domain.toLowerCase() === domainName) {
        return null
      } else {
        return { 'emailDomain': true };
      }
    };  
  }
}