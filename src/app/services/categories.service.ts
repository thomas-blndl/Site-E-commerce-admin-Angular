import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../models/category";
import {Response} from "../models/response";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl = `${environment.api + 'category' + '?API_KEY=' + environment.api_key}`;

  constructor(private http: HttpClient) { }

  getCategory(): Observable<Response>{
    return this.http.get<Response>(this.baseUrl);
  }
}
