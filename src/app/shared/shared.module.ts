import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  NbLayoutModule,
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbListModule,
  NbUserModule,
  NbTabsetModule,
  NbActionsModule,
} from '@nebular/theme';

import {WebcamModule} from 'ngx-webcam';

const NG_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
];

const FIREBASE_MODULES = [
  AngularFireDatabaseModule,
  AngularFireAuthModule,
];

const NEBULAR_MODULES = [
  NbActionsModule,
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbUserModule,
  NbTabsetModule,
];


@NgModule({
  declarations: [],
  imports: [...NG_MODULES, ...FIREBASE_MODULES, ...NEBULAR_MODULES, WebcamModule],
  exports: [...NG_MODULES, ...FIREBASE_MODULES, ...NEBULAR_MODULES, WebcamModule],
})
export class SharedModule { }
