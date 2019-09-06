import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../models/auth.model";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  // Attention! Create an user object later
  private userId: string;
  // Push the authentication information to the components
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    // Return as observable because I want to be able to lsiten from components but not to change it
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    // Update it also in logout
    return this.userId;
  }

  createUser(
    fullname: string,
    username: string,
    email: string,
    password: string,
    image: File
  ) {
    const authData = new FormData();
    authData.append("image", image, email);
    authData.append("fullname", fullname);
    authData.append("username", username);
    authData.append("email", email);
    authData.append("password", password);
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {
        this.router.navigate(["/auth/login"]);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    // ATTENTION! NEEDS TO CREATE TWO MODLES; USER AND AUTH
    const authData: AuthData = {
      imagePath: "",
      fullname: "",
      username: "",
      email: email,
      password: password
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            // Set a timer to logout in 3600.000 ms
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            // Saving information in the local storage
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) return;
    const now = new Date();
    // Difference between them in ms
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    // Attention! How to push a new value to the components
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
