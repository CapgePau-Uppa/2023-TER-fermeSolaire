import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurposePageComponent } from './purpose-page/purpose-page.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {path: '', component: MapComponent},
  {path: 'purpose', component: PurposePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
