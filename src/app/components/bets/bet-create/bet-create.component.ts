import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

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
  private mode = "create";
  private betId: string;

  constructor(public betsService: BetsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.onSetMode();
  }

  onSetMode() {
    // Attention: REPEAT FOR SHOWING THE HEADER
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("betId")) {
        this.mode = "edit";
        this.betId = paramMap.get("betId");
        // ATTENTION: HOW TO RETURN FROM SUBSCRIBE (IN COMPONENT - NO SERVICE)
        // This keep the data after reloading the bet create/edit component
        this.betsService.getBet(this.betId).subscribe(betData => {
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
        });
      } else {
        this.mode = "create";
        this.betId = null;
      }
    });
  }
  onSaveBet(form: NgForm) {
    if (form.invalid) return;
    const betSaved: Bet = this.onBuildBet(form.value);
    if (this.mode === "create") this.betsService.addBet(betSaved);
    else {
      betSaved.id = this.betId;
      this.betsService.updateBet(betSaved);
    }
    form.resetForm();
  }

  /**
   * Check if the email searched is the email of one of the emails stored in the database
   * @param email String obtained from the form
   */
  onAddParticipant(email) {
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
