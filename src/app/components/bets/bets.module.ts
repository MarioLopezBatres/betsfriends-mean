import { NgModule } from "@angular/core";
import { BetCreateComponent } from "./bet-create/bet-create.component";
import { BetListComponent } from "./bet-list/bet-list.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../../angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [BetCreateComponent, BetListComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class BetsModule {}
