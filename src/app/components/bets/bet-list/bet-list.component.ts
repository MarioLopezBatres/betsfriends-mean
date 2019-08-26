import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Bet } from "src/app/models/bet.model";
import { BetsService } from "src/app/services/bets.service";

@Component({
  selector: "app-bet-list",
  templateUrl: "./bet-list.component.html",
  styleUrls: ["./bet-list.component.css"]
})
export class BetListComponent implements OnInit, OnDestroy {
  bets: Bet[] = [];
  private betsSub: Subscription;

  constructor(public betsService: BetsService) {}

  ngOnInit() {
    this.betsService.getBets();
    this.betsSub = this.betsService
      .getBetUpdateListener()
      .subscribe((bets: Bet[]) => {
        this.bets = bets;
      });
  }

  onDelete(betId: string) {
    this.betsService.deleteBet(betId);
  }

  ngOnDestroy() {
    this.betsSub.unsubscribe();
  }
}
