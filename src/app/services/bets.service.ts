import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Bet } from "../models/bet.model";

@Injectable({
  providedIn: "root"
})
export class BetsService {
  private bets: Bet[] = [];
  private betsUpdated = new Subject<Bet[]>();

  constructor() {}

  getBets() {
    return [...this.bets];
  }

  getBetUpdateListener() {
    return this.betsUpdated.asObservable();
  }

  // Attention: Creo que será mejor usar bet: Bet
  addBet(betAdded: Bet) {
    this.bets.push(betAdded);
    this.betsUpdated.next([...this.bets]);
  }
}
