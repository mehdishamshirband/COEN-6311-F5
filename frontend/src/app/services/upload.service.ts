import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File, uploadDir: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('url', file, file.name);
    formData.append('caption', file.name);
    formData.append('upload_dir', uploadDir);

    // Adjust the URL to your backend file upload endpoint
    const uploadUrl = 'http://localhost:8000/upload/photo/';

    return this.http.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
