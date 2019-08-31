import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../models/auth.model";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  // Push the authentication information to the components
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    // Return as observable because I want to be able to lsiten from components but not to change it
    return this.authStatusListener.asObservable();
  }

  createUser(username: string, email: string, password: string, image: File) {
    const authData = new FormData();
    authData.append("image", image, email);
    authData.append("username", username);
    authData.append("email", email);
    authData.append("password", password);
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/login"]);
      });
  }

  login(email: string, password: string) {
    // ATTENTION! NEEDS TO CREATE TWO MODLES; USER AND AUTH
    const authData: AuthData = {
      imagePath: "",
      username: "",
      email: email,
      password: password
    };
    this.http
      .post<{ token: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authStatusListener.next(true);
      });
  }
}
