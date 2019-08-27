import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

import { Bet } from "src/app/models/bet.model";
import { BetsService } from "src/app/services/bets.service";

@Component({
  selector: "app-bet-list",
  templateUrl: "./bet-list.component.html",
  styleUrls: ["./bet-list.component.css"]
})
export class BetListComponent implements OnInit, OnDestroy {
  bets: Bet[] = [];
  isLoading = false;
  totalBets = 0;
  betsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private betsSub: Subscription;

  constructor(public betsService: BetsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.betsService.getBets(this.betsPerPage, this.currentPage);
    this.betsSub = this.betsService
      .getBetUpdateListener()
      .subscribe((betData: { bets: Bet[]; betCount: number }) => {
        this.isLoading = false;
        this.totalBets = betData.betCount;
        this.bets = betData.bets;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.betsPerPage = pageData.pageSize;
    this.betsService.getBets(this.betsPerPage, this.currentPage);
  }

  onDelete(betId: string) {
    this.isLoading = true;

    this.betsService.deleteBet(betId).subscribe(() => {
      this.betsService.getBets(this.betsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.betsSub.unsubscribe();
  }
}
