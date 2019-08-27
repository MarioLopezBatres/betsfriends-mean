import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { mimeType } from "src/app/validators/mime-type.validator";
import { allSettled } from "q";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.initializeReactiveForm();
    this.isLoading = false;
  }

  initializeReactiveForm() {
    this.form = new FormGroup({
      // initialValue, attach validators or form control options,
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      username: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onSignUp() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.createUser(
      this.form.value.username,
      this.form.value.email,
      this.form.value.password,
      this.form.value.image
    );
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // patchValue allows to targe a single control. Set value is for the whole form
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
