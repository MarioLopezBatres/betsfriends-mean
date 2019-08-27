import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../models/auth.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  createUser(username: string, email: string, password: string, image: File) {
    const userData = new FormData();
    userData.append("image", image, email);
    userData.append("username", username);
    userData.append("email", email);
    userData.append("password", password);
    this.http
      .post("http://localhost:3000/api/user/signup", userData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/login"]);
      });
  }
}
