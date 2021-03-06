import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  authState: Observable<{} | null>;

  userRef: Observable<firebase.User | null>;
  userUid: string;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    console.log('LOGIN SERVICE CONSTRUCTOR CALLED');
    this.userRef = this.afAuth.authState
    .pipe(switchMap((user) => {
      if (user) {
        this.userUid = user.uid;
        console.log('SWITCHMAP');
        console.log(user);
        console.log('SWITCHMAP');
        return this.db.object(`users/${user.uid}`).update({email: user.email}).then( () => {
          return this.db.object(`users/${user.uid}`).valueChanges();
        }).catch( (error) => {
          console.log('ERROR UPDATING USER EMAIL');
          console.log(error);
          console.log('ERROR UPDATING USER EMAIL');
        });
      } else {
        console.log('USER NOT YET LOGGED IN');
        return of(null);
      }
    }));
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((auth) => {
        console.log(`USER ID ${auth.user.uid}`);
        this.userUid = auth.user.uid;
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        console.log('CREATED AT');
        console.log(createdAt);
        console.log('CREATED AT');
        const sessionKey = this.db.database
                        .ref(`sessions`)
                        .push({
                          userUid: auth.user.uid
                        }).key;

        const sessionPayload: any = {
          createdAt: createdAt,
          userUid: auth.user.uid,
          currentSessionKey: sessionKey,
        };

        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${sessionKey}`] = {'createdAt': createdAt};
        return this.db.database.ref().update(sessionPayloads);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  registerWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        console.log(`USER ID ${auth.user.uid}`);
        this.userUid = auth.user.uid;
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        console.log('CREATED AT');
        console.log(createdAt);
        console.log('CREATED AT');
        const sessionKey = this.db.database
                        .ref(`sessions`)
                        .push({
                          userUid: auth.user.uid
                        }).key;

        const sessionPayload: any = {
          createdAt: createdAt,
          userUid: auth.user.uid,
          currentSessionKey: sessionKey,
        };

        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${sessionKey}`] = {'createdAt': createdAt};
        return this.db.database.ref().update(sessionPayloads);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  isCurrentUserAdmin(): Observable<boolean> {
    return this.db.object(`admins/${this.userUid}`)
      .valueChanges()
      .pipe(
        map( admin => {
          if (!!admin) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getUserStatus() {
    return this.afAuth.user;
  }

  getAuthState() {
    return this.userRef;
  }
}
