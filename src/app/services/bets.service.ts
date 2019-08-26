import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Bet } from "../models/bet.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class BetsService {
  private bets: Bet[] = [];
  private betsUpdated = new Subject<Bet[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getBets() {
    this.http
      .get<{ message: string; bets: any }>("http://localhost:3000/api/bets")
      // In order to change the _id obtained from mongoose
      // It could be also solved by changed the field id to _id in the models
      // video 55
      .pipe(
        map(betData => {
          return betData.bets.map(bet => {
            return {
              id: bet._id,
              title: bet.title,
              description: bet.description,
              startDate: bet.startDate,
              endDate: bet.endDate,
              private: bet.private,
              comments: bet.comments,
              prize: bet.prize,
              participants: bet.participants
            };
          });
        })
      )
      .subscribe(tansformedBets => {
        this.bets = tansformedBets;
        this.betsUpdated.next([...this.bets]);
      });
  }

  getBetUpdateListener() {
    return this.betsUpdated.asObservable();
  }

  // ERROR! WHY CAN'T I SEND JUST A BET AS AN ANSWER? IT WORKS BUT IT SHOWS AN ERROR IN IDE
  getBet(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      private: boolean;
      comments: boolean;
      participants: [];
      prize: string;
    }>("http://localhost:3000/api/bets/" + id);
  }

  addBet(betAdded: Bet) {
    this.http
      .post<{ message: string; betId: string }>(
        "http://localhost:3000/api/bets",
        betAdded
      )
      .subscribe(responseData => {
        const id = responseData.betId;
        betAdded.id = id;
        this.bets.push(betAdded);
        this.betsUpdated.next([...this.bets]);
        this.router.navigate(["/"]);
      });
  }

  updateBet(bet: Bet) {
    this.http
      .put("http://localhost:3000/api/bets/" + bet.id, bet)
      .subscribe(response => {
        const updatedBets = [...this.bets];
        const oldBetIndex = updatedBets.findIndex(b => b.id === bet.id);
        updatedBets[oldBetIndex] = bet;
        this.bets = updatedBets;
        this.betsUpdated.next([...this.bets]);
        this.router.navigate(["/"]);
      });
  }

  deleteBet(betId: string) {
    this.http
      .delete("http://localhost:3000/api/bets/" + betId)
      .subscribe(() => {
        const updatedBets = this.bets.filter(bet => {
          bet.id !== betId;
        });
        this.bets = updatedBets;
        this.betsUpdated.next([...this.bets]);
      });
  }
}
