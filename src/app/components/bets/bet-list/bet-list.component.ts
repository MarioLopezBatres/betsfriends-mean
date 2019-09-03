import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

import { Bet } from "src/app/models/bet.model";
import { BetsService } from "src/app/services/bets.service";
import { AuthService } from "src/app/services/auth.service";

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
  userIsAuthethenticated = false;
  userId: string;

  private betsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public betsService: BetsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getBets();
    this.getAuthStatus();
    this.getUser();
  }

  getUser() {
    // Attention! Update also in getAuthStatus()
    this.userId = this.authService.getUserId();
  }

  getBets() {
    this.betsService.getBets(this.betsPerPage, this.currentPage);
    this.betsSub = this.betsService
      .getBetUpdateListener()
      .subscribe((betData: { bets: Bet[]; betCount: number }) => {
        this.isLoading = false;
        this.totalBets = betData.betCount;
        this.bets = betData.bets;
      });
  }

  getAuthStatus() {
    // It is required to make both calls to update the value in this component in order to be sure that it will happen
    this.userIsAuthethenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthethenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
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
    this.betsService.deleteBet(betId).subscribe(
      () => {
        this.betsService.getBets(this.betsPerPage, this.currentPage);
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.betsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
