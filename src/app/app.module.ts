import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarteComponent } from './carte/carte.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PurposePageComponent } from './purpose-page/purpose-page.component';
import { ButtonsPurposeComponent } from './buttons-purpose/buttons-purpose.component';

@NgModule({
  declarations: [
    AppComponent,
    CarteComponent,
    ButtonsComponent,
    SearchBarComponent,
    LandingPageComponent,
    PurposePageComponent,
    ButtonsPurposeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
