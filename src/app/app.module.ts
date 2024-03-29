import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PurposePageComponent } from './purpose-page/purpose-page.component';
import { ExplicationPageComponent } from './explication-page/explication-page.component';
import { DocumentationPageComponent } from './documentation-page/documentation-page.component';
import { ButtonsPurposeComponent } from './buttons-purpose/buttons-purpose.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ButtonsComponent,
    SearchBarComponent,
    LandingPageComponent,
    PurposePageComponent,
    ExplicationPageComponent,
    DocumentationPageComponent,
    ButtonsPurposeComponent,
    SidebarComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
