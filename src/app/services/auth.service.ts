import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Storage } from '@ionic/storage';

import { AlertController } from '@ionic/angular';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private db: DatabaseService
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    await this.updateUserDataOnLogin(credential.user);
  }

  // Sets user data to locally and firestore on login
  private async updateUserDataOnLogin({ uid, email, displayName, photoURL }) {
    // local
    await this.storage.set('user', { uid, email, displayName, photoURL });
    // firestore
    await this.afs
      .doc(`users/${uid}`)
      .set({ uid, email, displayName, photoURL }, { merge: true });
  }

  signOut() {
    this.storage
      .remove('user')
      .then(() => this.router.navigate(['/welcome']))
      .then(() => this.afAuth.auth.signOut());
  }

  // Delete authenticated user
  async deleteUser() {
    // Get fresh credential
    const { credential, user } = await this.afAuth.auth.signInWithPopup(
      new auth.GoogleAuthProvider()
    );

    // Get user email from storage
    const { email } = await this.storage.get('user');

    // Check if logged in user email matches fresh credential
    if (email === user.email) {
      // Delete all templates and user data
      await this.db.deleteUserData();
      // Remove user data from storage
      await this.storage.remove('user');
      await this.router.navigate(['/welcome']);
      // Delete user account from Firebase
      const user = this.afAuth.auth.currentUser;
      await user.reauthenticateWithCredential(credential);
      await user.delete();
    } else {
      throw new Error(
        'Please reauthenticate using the Google account with which you are currently signed in to PostMate.'
      );
    }
  }
}
