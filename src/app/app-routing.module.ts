import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BetListComponent } from "./components/bets/bet-list/bet-list.component";
import { BetCreateComponent } from "./components/bets/bet-create/bet-create.component";
import { AuthGuard } from "./guards/auth.guards";

const routes: Routes = [
  {
    path: "",
    component: BetListComponent,
    children: [
      {
        path: "active-bets",
        component: BetListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "private-bets",
        component: BetListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "public-bets",
        component: BetListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "finished-bets",
        component: BetListComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: "create", component: BetCreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:betId",
    component: BetCreateComponent,
    canActivate: [AuthGuard]
  },
  // Login and Signup are lazy loaded in auth-routing.module.ts
  // can no be used "login" as a path cause it is aready used in auth-routing.module.ts
  // It is required to remove AuthModule from app.module.ts
  { path: "auth", loadChildren: "./components/auth/auth.module#AuthModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
