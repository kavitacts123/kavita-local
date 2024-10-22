import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {
    private apiUrl;
    constructor(private http: HttpClient) {
        this.apiUrl = environment?.apiUrl;
    
    }
    getSystemPopups(data:any): Observable<{ status: boolean, message: string, data: any }> {
        let params = new HttpParams();
        // Loop through the queryParams object and set each parameter
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                params = params.set(key, data[key]);
            }
        }
        return this.http.get<{ status: boolean, message: string, data: any }>(
            `${this.apiUrl}admin/get-system-popups`, {params}
        );
    }

    getRolePaymentTypes(): Observable<{ status: boolean, message: string, data: any }> {
        
        return this.http.get<{ status: boolean, message: string, data: any }>(
            `${this.apiUrl}admin/get-role-payment-types`
        );
    }

    addPopups(record: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}admin/add-system-popup`, record);
    }
    // Method to update an existing record
    updatePopups(id: number, record: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}admin/edit-system-popup/${id}`, record);
    }

    // Method to delete a record by IDs
    deletePopups(params: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}admin/delete-system-popup`, params);
    }
}