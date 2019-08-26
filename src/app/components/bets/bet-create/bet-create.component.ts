import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Bet } from "src/app/models/bet.model";
import { BetsService } from "src/app/services/bets.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-bet-create",
  templateUrl: "./bet-create.component.html",
  styleUrls: ["./bet-create.component.css"]
})
export class BetCreateComponent implements OnInit {
  localParticipantsList: string[] = [];
  bet: Bet;
  // Show/Hide the spinner
  isLoading = false;
  form: FormGroup;

  private mode = "create";
  private betId: string;

  constructor(public betsService: BetsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.initializeReactiveForm();
    this.onSetMode();
  }

  initializeReactiveForm() {
    this.form = new FormGroup({
      // initialValue, attach validators or form control options,
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
      private: new FormControl(false, { validators: [Validators.required] }),
      comments: new FormControl(false, { validators: [Validators.required] }),
      prize: new FormControl("", { validators: [] }),
      participants: new FormControl([], { validators: [Validators.required] })
    });
  }

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
          this.isLoading = true;
          this.bet = {
            id: betData._id,
            title: betData.title,
            description: betData.description,
            startDate: betData.startDate,
            endDate: betData.endDate,
            private: betData.private,
            comments: betData.comments,
            prize: betData.prize,
            participants: betData.participants
          };
          this.form.setValue({
            title: this.bet.title,
            description: this.bet.description,
            startDate: this.bet.startDate,
            endDate: this.bet.endDate,
            private: this.bet.private,
            comments: this.bet.comments,
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

  onSaveBet() {
    if (this.form.invalid) return;
    this.isLoading = true;
    const betSaved: Bet = this.onBuildBet(this.form.value);
    if (this.mode === "create") this.betsService.addBet(betSaved);
    else {
      betSaved.id = this.betId;
      this.betsService.updateBet(betSaved);
    }
    this.form.reset();
  }

  /**
   * Check if the email searched is the email of one of the emails stored in the database
   * @param email String obtained from the form
   */
  onAddParticipant(email) {
    console.log(email);
    event.preventDefault();
    this.localParticipantsList.push(email);
  }

  /**
   * Build a new Bet using the data obtained from the form in order to send it to addBet ot the service
   * @param formValues Values provided by the create-bet form
   */
  onBuildBet(formValues) {
    let betBuilt: Bet = {
      id: null,
      title: formValues.title,
      description: formValues.description,
      prize: formValues.prize,
      private: formValues.private,
      comments: formValues.comments,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      participants: this.localParticipantsList
    };
    return betBuilt;
  }
}
