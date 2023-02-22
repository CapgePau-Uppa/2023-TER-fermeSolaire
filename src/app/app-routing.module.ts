import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PurposePageComponent } from './purpose-page/purpose-page.component';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'purpose', component: PurposePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
