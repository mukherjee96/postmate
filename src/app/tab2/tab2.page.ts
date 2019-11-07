import { Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy {
  name: string = '';
  header: string = '';
  footer: string = '';

  constructor(
    public alertController: AlertController,
    public db: DatabaseService,
    public auth: AuthService,
    public storage: Storage
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  addTemplate(name, header, footer) {
    if (name && (header || footer)) {
      this.db.createTemplate({
        name,
        header,
        footer
      });
      this.presentAlert(
        'Template Added',
        'You can swipe your templates right to edit or delete them.'
      );
      this.clearForm();
    } else {
      this.presentAlert(
        "Your Template Wasn't Added",
        'Please provide the template name along with a header or a footer.'
      );
    }
  }

  clearForm() {
    this.name = '';
    this.header = '';
    this.footer = '';
  }

  ngOnDestroy() {}
}
