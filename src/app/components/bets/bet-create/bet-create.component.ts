import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Bet } from "src/app/models/bet.model";
import { BetsService } from "src/app/services/bets.service";

@Component({
  selector: "app-bet-create",
  templateUrl: "./bet-create.component.html",
  styleUrls: ["./bet-create.component.css"]
})
export class BetCreateComponent implements OnInit {
  localParticipantsList: string[] = [];

  constructor(public betsService: BetsService) {}

  ngOnInit() {}

  onAddBet(form: NgForm) {
    if (form.invalid) return;
    form.value.startDate = this.onBuildDate(form.value.startDate);
    form.value.endDate = this.onBuildDate(form.value.endDate);
    const betAdded: Bet = this.onBuildBet(form.value);
    this.betsService.addBet(betAdded);
    form.resetForm();
  }

  /**
   * Check if the email searched is the email of one of the emails stored in the database
   * @param email String obtained from the form
   */
  onAddParticipant(email) {
    event.preventDefault();
    this.localParticipantsList.push(email);
    console.log(this.localParticipantsList);
  }

  /**
   * Build a new Bet using the data obtained from the form in order to send it to addBet ot the service
   * @param formValues Values provided by the create-bet form
   */
  onBuildBet(formValues) {
    let betBuilt: Bet = {
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

  onBuildDate(date: Date) {
    return (
      date.getMonth().toString() +
      "/" +
      date.getDate().toString() +
      "/" +
      date.getFullYear().toString()
    );
  }
}
