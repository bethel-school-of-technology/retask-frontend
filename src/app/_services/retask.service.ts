import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, } from 'rxjs';

import { environment } from '@environments/environment'

import { UserUpdateForm} from '@app/_models/user'

@Injectable({
  providedIn: 'root'
})
export class ReTaskService {

  constructor(public http: HttpClient,
    private sanitizer: DomSanitizer) { }

  // sanitize a link
  transform(html) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }

  // authenicateUser for now.  returns a user with a token
  authenticateUser(username, password): Observable<any> {
    let xurlParm = `${environment.reTaskUrl}/api/auth/signin`
    let dataIs = {
      "username": username,
      "password": password
    }
    return this.http.post(xurlParm, dataIs
      , {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  // create a new user.  Requires no security.
  registerUser(dataIs): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/auth/signup`
    return this.http.post(urlParm, dataIs
      , {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  // get test.  This requires a token.
  test(token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/test/user`
    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/text'),
      }
    );
  }

  //get picture.  This requires a token.
  getPic(token: string): Observable<Blob> {
    let urlParm = `${environment.reTaskUrl}/user/downloadPic`
     return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'blob'
      }
    );
  }

  //update the user.  This requires a token.
  setPic(pic: File , token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/user/uploadPic`

    let formData = new FormData(); 

    formData.append("file", pic, pic.name);

    return this.http.post(urlParm, formData
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      }
    );
  }

  //update the user.  This requires a token.
  updateUser(user: UserUpdateForm, token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/user/updateUser`
    return this.http.post(urlParm, user
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
        .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

  // reset the password
  resetPassword(dataIs:any, token: string) {
    let urlParm = `${environment.reTaskUrl}/user/changePassword`
    return this.http.post(urlParm, dataIs
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
        .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }

}
