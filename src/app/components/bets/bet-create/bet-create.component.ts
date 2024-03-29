import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Bet } from "src/app/models/bet.model";
import { BetsService } from "src/app/services/bets.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { mimeType } from "../../../validators/mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-bet-create",
  templateUrl: "./bet-create.component.html",
  styleUrls: ["./bet-create.component.css"]
})
export class BetCreateComponent implements OnInit, OnDestroy {
  localParticipantsList: string[] = [];
  bet: Bet;
  // Show/Hide the spinner
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private mode = "create";
  private betId: string;
  private authStatusSub: Subscription;

  constructor(
    public betsService: BetsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.setAuthStatusListener();
    this.initializeReactiveForm();
    this.onSetMode();
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
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
      private: new FormControl(false, { validators: [Validators.required] }),
      prize: new FormControl(null, { validators: [Validators.required] }),
      participants: new FormControl(null, { validators: [] })
    });
  }

  /** Define the mode in which the component will be displayed and its behaviour; create/edit */
  onSetMode() {
    // Attention: REPEAT FOR SHOWING THE HEADER
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("betId")) {
        this.mode = "edit";
        this.betId = paramMap.get("betId");
        this.isLoading = true;
        // ATTENTION: HOW TO RETURN FROM SUBSCRIBE (IN COMPONENT - NO SERVICE)
        // This keep the data after reloading the bet create/edit component
        this.betsService.getBet(this.betId).subscribe(betData => {
          this.isLoading = false;
          this.bet = {
            id: betData._id,
            creator: betData.creator,
            title: betData.title,
            description: betData.description,
            startDate: betData.startDate,
            endDate: betData.endDate,
            private: betData.private,
            prize: betData.prize,
            participants: betData.participants,
            imagePath: betData.imagePath
          };
          this.form.setValue({
            image: this.bet.imagePath,
            title: this.bet.title,
            description: this.bet.description,
            startDate: this.bet.startDate,
            endDate: this.bet.endDate,
            private: this.bet.private,
            prize: this.bet.prize,
            participants: this.bet.participants
          });
        });
      } else {
        this.mode = "create";
        this.betId = null;
      }
    });
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

  /**
   * Creates or updates the bets depending on the mode of the component
   */
  onSaveBet() {
    if (this.form.invalid) return;
    this.isLoading = true;
    const betSaved: Bet = this.onBuildBet(this.form.value);
    if (this.mode === "create")
      this.betsService.addBet(betSaved, this.form.value.image);
    else {
      betSaved.id = this.betId;
      this.betsService.updateBet(betSaved, this.form.value.image);
    }
    this.form.reset();
  }

  /**
   * Checks if the email searched is the email of one of the emails stored in the database
   * @param email String obtained from the form
   */
  onAddParticipant(email) {
    event.preventDefault();
    this.localParticipantsList.push(email);
  }

  /**
   * Builds a new Bet using the data obtained from the form in order to send it to addBet ot the service
   * @param formValues Values provided by the create-bet form
   */
  onBuildBet(formValues) {
    let betBuilt: Bet = {
      id: null,
      creator: null,
      imagePath: null,
      title: formValues.title,
      description: formValues.description,
      prize: formValues.prize,
      private: formValues.private,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      participants: this.localParticipantsList
    };
    return betBuilt;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
