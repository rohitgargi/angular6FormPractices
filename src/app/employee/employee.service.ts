import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { IEmployee } from './IEmployee';

import {catchError} from 'rxjs/operators';


@Injectable()
export class EmployeeService{
    constructor(private httpClient:HttpClient){

    }
    baseUrl='http://localhost:3000/employees';
    getEmployees() : Observable <IEmployee[]>{
        return this.httpClient.get<IEmployee[]>(this.baseUrl)
        .pipe(catchError(this.handleErrors));
    }

    getEmployee(id:number): Observable<IEmployee>{
        return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`)
        .pipe(catchError(this.handleErrors))
    }


    private handleErrors(errorResponse : HttpErrorResponse){
        if(errorResponse.error instanceof ErrorEvent){
            console.error("Client side error",errorResponse.error);
        }else{
            console.error('Server side error',errorResponse);
        }

        return  throwError('There is some problem with the service');
    }
}