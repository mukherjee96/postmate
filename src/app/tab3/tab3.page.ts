import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { NgNavigatorShareService } from 'ng-navigator-share';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userData = this.storage.get('user');
  constructor(
    public auth: AuthService,
    public router: Router,
    public alertController: AlertController,
    private ngNavigatorShareService: NgNavigatorShareService,
    private storage: Storage
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async signOutHandler() {
    const alert = await this.alertController.create({
      header: 'Sign out of PostMate',
      message:
        'All your templates will still be available when you sign in next.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Okay',
          handler: () => this.signOut()
        }
      ]
    });

    await alert.present();
  }

  signOut() {
    this.auth.signOut();
  }

  async showAbout() {
    const alert = await this.alertController.create({
      header: 'About PostMate',
      message: `
        <p>Version: Beta</p>
        <p>Made with &#10084; by <a href="https://dev.to/mukherjee96">@mukherjee96</a></p>
      `,
      buttons: ['OK']
    });

    await alert.present();
  }

  async desktopShare() {
    const alert = await this.alertController.create({
      header: 'Share PostMate',
      message:
        'This is where PostMate lives: <br/><br/><a href="https://postmate-progressive.web.app">https://postmate-progressive.web.app</a>',
      buttons: ['Done']
    });

    await alert.present();
  }

  async sharePostMate() {
    try {
      await this.ngNavigatorShareService.share({
        title: 'Share PostMate',
        text: 'Create cloud-synced social media post templates with PostMate!',
        url: 'https://postmate-progressive.web.app'
      });
    } catch (error) {
      console.log('Sorry, PostMate was not shared as: ', error.error);
      this.desktopShare();
    }
  }

  async deleteAccountHandler() {
    const alert = await this.alertController.create({
      header: 'Are you absolutely sure?',
      message: `
        <p>This action <strong>cannot</strong> be undone.</p>
        <p>This will permanently delete all your templates along with your PostMate account.</p>
        <p>Clicking on Delete will take you to the account re-authentication screen.</p>
        <p>Please type in your Google email below to confirm.</p>`,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Enter Google Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel 😃',
          role: 'cancel',
          cssClass: 'tertiary'
        },
        {
          text: 'Delete 😔',
          cssClass: 'danger',
          handler: alertData => {
            this.storage.get('user').then(user => {
              if (alertData.email === user.email) {
                this.auth
                  .deleteUser()
                  .then(() => window.location.reload())
                  .catch(err =>
                    this.presentAlert('Account Deletion Failed', err)
                  );
              } else {
                this.presentAlert(
                  'Incorrect Email',
                  'The email you provided did not match with our records.'
                );
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
