import { NgModule } from "@angular/core";
import { LoginComponent } from "../components/auth/login/login.component";
import { SignupComponent } from "../components/auth/signup/signup.component";
import { AngularMaterialModule } from "./angular-material.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthModule {}
