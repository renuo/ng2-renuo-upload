import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class RequestService {
  public makeRequest(options: RequestOption): Observable<RequestReponse> {
    return Observable.create((observer: Observer<RequestReponse>) => {
      const xhr = new XMLHttpRequest();

      xhr.open(options.method, options.url);

      xhr.onload = () => {
        if (xhr.status <= 200 || xhr.status >= 300) {
          observer.error(xhr.status);
        }
      };

      xhr.upload.onprogress = evt => {
        observer.next({
          status: xhr.status,
          progress: (evt.loaded / evt.total) * 100
        });
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          observer.next({
            response: xhr.response,
            status: xhr.status
          });
          observer.complete();
        }
      };

      xhr.onerror = () => {
        observer.error(xhr.status);
      };
      xhr.send(options.formData);
    });
  }
}
