import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Bet } from "../models/bet.model";
import { Router } from "@angular/router";
import { identifierModuleUrl } from "@angular/compiler";

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
              imagePath: bet.imagePath,
              title: bet.title,
              description: bet.description,
              startDate: bet.startDate,
              endDate: bet.endDate,
              private: bet.private,
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
      participants: [];
      prize: string;
      imagePath: string;
    }>("http://localhost:3000/api/bets/" + id);
  }

  addBet(betAdded: Bet, image: File) {
    const betData = new FormData();
    betData.append("title", betAdded.title);
    betData.append("description", betAdded.description);
    betData.append("startDate", new Date(betAdded.startDate).toUTCString());
    betData.append("endDate", new Date(betAdded.endDate).toUTCString());
    betData.append("private", JSON.stringify(betAdded.private));
    betData.append("prize", betAdded.prize);
    for (let i = 0; i < betAdded.participants.length; i++) {
      betData.append("participants", betAdded.participants[i].toString());
    }
    betData.append("image", image, betAdded.title);
    this.http
      .post<{ message: string; bet: Bet }>(
        "http://localhost:3000/api/bets",
        betData
      )
      .subscribe(responseData => {
        betAdded.id = responseData.bet.id;
        betAdded.id = responseData.bet.imagePath;
        this.bets.push(betAdded);
        this.betsUpdated.next([...this.bets]);
        this.router.navigate(["/"]);
      });
  }

  updateBet(betUpdated: Bet, image: File | string) {
    let betData: Bet | FormData;
    if (typeof image === "object") {
      betData = new FormData();
      betData.append("id", betUpdated.id);
      betData.append("image", image, betUpdated.title);
      betData.append("title", betUpdated.title);
      betData.append("description", betUpdated.description);
      betData.append("prize", betUpdated.prize);
      betData.append("startDate", new Date(betUpdated.startDate).toUTCString());
      betData.append("endDate", new Date(betUpdated.endDate).toUTCString());
      betData.append("private", JSON.stringify(betUpdated.private));
      for (let i = 0; i < betUpdated.participants.length; i++) {
        betData.append("participants", betUpdated.participants[i]);
      }
    } else {
      betData = {
        id: betUpdated.id,
        imagePath: image,
        title: betUpdated.title,
        description: betUpdated.description,
        prize: betUpdated.prize,
        startDate: betUpdated.startDate,
        endDate: betUpdated.endDate,
        private: betUpdated.private,
        participants: betUpdated.participants
      };
    }
    this.http
      .put("http://localhost:3000/api/bets/" + betUpdated.id, betData)
      .subscribe(response => {
        const updatedBets = [...this.bets];
        const oldBetIndex = updatedBets.findIndex(b => b.id === betUpdated.id);
        const bet: Bet = {
          id: betUpdated.id,
          imagePath: "",
          title: betUpdated.title,
          description: betUpdated.description,
          prize: betUpdated.prize,
          startDate: betUpdated.startDate,
          endDate: betUpdated.endDate,
          private: betUpdated.private,
          participants: betUpdated.participants
        };
        updatedBets[oldBetIndex] = betUpdated;
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
