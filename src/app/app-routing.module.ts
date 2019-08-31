import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BetListComponent } from "./components/bets/bet-list/bet-list.component";
import { BetCreateComponent } from "./components/bets/bet-create/bet-create.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { SignupComponent } from "./components/auth/signup/signup.component";
import { AuthGuard } from "./components/guards/auth.guards";

const routes: Routes = [
  { path: "", component: BetListComponent },
  { path: "create", component: BetCreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:betId",
    component: BetCreateComponent,
    canActivate: [AuthGuard]
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
