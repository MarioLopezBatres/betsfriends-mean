import { NgModule } from "@angular/core";
import { BetCreateComponent } from "../components/bets/bet-create/bet-create.component";
import { BetListComponent } from "../components/bets/bet-list/bet-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "./angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [BetCreateComponent, BetListComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class BetsModule {}
