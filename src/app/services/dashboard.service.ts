import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from 'talkjs/all';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private apiUrl;
    constructor(private http: HttpClient) {
        this.apiUrl = environment?.apiUrl;
    
    }
    getChartData(year:number): Observable<{ status: boolean, message: string, data: any }> {
        return this.http.get<{ status: boolean, message: string, data: any }>(
            `${this.apiUrl}admin/get-graph-data/${year}`,
          );
    }

    getNewRegistration(limit=3): Observable<{ status: boolean, message: string, data: { userData: User[],totalCount:number } }> {
        const params = new HttpParams()
        .set('limit', '10')
        .set('orderBy', limit)
        .set('order', 'desc');
      return this.http.get<{ status: boolean, message: string, data: { userData: User[],totalCount:number } }>(
        `${this.apiUrl}admin/users`,
        { params}
      );
    }

    getUsers(): Observable<{ status: boolean, message: string, data: { userData: User[],totalCount:number } }> {
        const params = new HttpParams()
          .set('limit', '10')
          .set('orderBy', 'id')
          .set('order', 'desc');
        return this.http.get<{ status: boolean, message: string, data: { userData: User[],totalCount:number } }>(
          `${this.apiUrl}admin/users`,
          { params}
        );
      }

}