

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgMentionModule } from '../../node_modules/angular-mention';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgMentionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
