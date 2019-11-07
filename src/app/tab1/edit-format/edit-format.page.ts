import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { Template } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-edit-format',
  templateUrl: './edit-format.page.html',
  styleUrls: ['./edit-format.page.scss']
})
export class EditFormatPage implements OnInit, OnDestroy {
  private templateDataSub: Subscription;
  templateData: Template;
  docId: string;
  uid: string;

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async presentToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      mode: 'ios',
      color: 'tertiary'
    });
    toast.present();
  }

  updateTemplate() {
    this.db.updateTemplate(this.docId, this.templateData);
    this.presentToast('Your template was updated successfully', 2000);
    this.router.navigate(['/tabs/templates']);
  }

  ngOnInit() {
    this.templateDataSub = this.route.params
      .pipe(
        take(1),
        tap(params => (this.docId = params['id'])),
        switchMap(params => {
          return this.db.getTemplate(params['id']);
        }),
        // Automatically resolves promise
        // and extracts template$ observable
        switchMap(template$ => template$)
      )
      .subscribe(template => {
        this.templateData = template;
      });
  }

  ngOnDestroy() {
    this.templateDataSub.unsubscribe();
  }
}
