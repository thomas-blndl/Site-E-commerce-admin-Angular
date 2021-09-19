import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = `${environment.api + 'image' + '?API_KEY=' + environment.api_key}`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any>{
    let fb: any = new FormData();
    fb.append('image',file);

    return this.http.post(this.baseUrl, fb, {
      reportProgress: true,
      observe: "events"
    });
  }

  deleteImage(name: string): Observable<any>{
    const url = this.baseUrl+"&name="+name;
    return this.http.delete(url);

  }
}
