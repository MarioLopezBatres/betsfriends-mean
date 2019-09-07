import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.setAuthStatusListener();
  }

  /** Creates a subscription to update isLoading when there is nothing logged in */
  setAuthStatusListener() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  /**
   * Calls authService in order to validate the login of an user
   * @param form data inserted in the form
   */
  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
