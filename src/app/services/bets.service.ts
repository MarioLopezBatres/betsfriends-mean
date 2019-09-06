import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Bet } from "../models/bet.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/bets/";

@Injectable({
  providedIn: "root"
})
export class BetsService {
  private bets: Bet[] = [];
  private betsUpdated = new Subject<{ bets: Bet[]; betCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getBets(betsPerPage: number, currentPage: number) {
    // query names are set in the backend
    const queryParams = `?mode=${this.router.url}&pagesize=${betsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; bets: any; maxBets: number }>(
        BACKEND_URL + queryParams
      )
      // In order to change the _id obtained from mongoose
      // It could be also solved by changed the field id to _id in the models
      // video 55
      .pipe(
        map(betData => {
          return {
            bets: betData.bets.map(bet => {
              return {
                id: bet._id,
                imagePath: bet.imagePath,
                title: bet.title,
                description: bet.description,
                startDate: bet.startDate,
                endDate: bet.endDate,
                private: bet.private,
                prize: bet.prize,
                participants: bet.participants,
                creator: bet.creator
              };
            }),
            maxBets: betData.maxBets
          };
        })
      )
      .subscribe(transformedBetData => {
        this.bets = transformedBetData.bets;
        this.betsUpdated.next({
          bets: [...this.bets],
          betCount: transformedBetData.maxBets
        });
      });
  }

  getBetUpdateListener() {
    return this.betsUpdated.asObservable();
  }

  // ERROR! WHY CAN'T I SEND JUST A BET AS AN ANSWER? IT WORKS BUT IT SHOWS AN ERROR IN IDE
  getBet(id: string) {
    return this.http.get<{
      _id: string;
      creator: string;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      private: boolean;
      participants: [];
      prize: string;
      imagePath: string;
    }>(BACKEND_URL + id);
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
      .post<{ message: string; bet: Bet }>(BACKEND_URL, betData)
      .subscribe(responseData => {
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
        // Creator to null to avoid posting information in the browers
        creator: null,
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
    this.http.put(BACKEND_URL + betUpdated.id, betData).subscribe(response => {
      this.router.navigate(["/"]);
    });
  }

  deleteBet(betId: string) {
    return this.http.delete(BACKEND_URL + betId);
  }
}
