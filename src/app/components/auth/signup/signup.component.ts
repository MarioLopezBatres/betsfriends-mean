import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { mimeType } from "src/app/validators/mime-type.validator";
import { allSettled } from "q";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  form: FormGroup;
  imagePreview: string;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.setAuthStatusListener();
    this.initializeReactiveForm();
  }

  /** Creates a subscription to update isLoading when there is nothing logged in */
  setAuthStatusListener() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  /** Initializes the form and its attributes and properties */
  initializeReactiveForm() {
    this.form = new FormGroup({
      // initialValue, attach validators or form control options,
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      fullname: new FormControl(null, {
        validators: [Validators.required]
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

  /**
   * Creates an user within the form data and reset the form
   */
  onSignUp() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.createUser(
      this.form.value.fullname,
      this.form.value.username,
      this.form.value.email,
      this.form.value.password,
      this.form.value.image
    );
    this.form.reset();
  }

  /**
   * Sets the file updated thorugh the input, stores the src in imagePreview, and shows a preview of it.
   * @param event The value of image input has changed
   */
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

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
