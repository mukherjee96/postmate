import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import {
  ToastController,
  AlertController,
  IonSearchbar,
  IonList
} from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DatabaseService, TemplateId } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  @ViewChild('search', { static: false }) searchBar: IonSearchbar;
  @ViewChild('listRef', { static: false }) listRef: IonList;
  templates$: Observable<TemplateId[]>;
  showSpinner: Boolean = true;

  constructor(
    private db: DatabaseService,
    private toastController: ToastController,
    private alertController: AlertController,
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

  async presentDeleteAlert(docId: string) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This template will be deleted.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Okay',
          handler: () => this.deleteTemplate(docId)
        }
      ]
    });

    await alert.present();
  }

  searchHandler() {
    this.searchBar.getInputElement().then(element => {
      this.templates$ = this.templates$.pipe(
        switchMap(
          (templates): Observable<TemplateId[]> => {
            let filteredList: TemplateId[] = templates.filter(template =>
              template.name.toLowerCase().includes(element.value.toLowerCase())
            );
            return of(filteredList);
          }
        )
      );
    });
  }

  editHandler(templateId) {
    this.listRef.closeSlidingItems();
    this.router.navigate(['/tabs/templates/edit', templateId]);
  }

  deleteTemplate(docId: string) {
    this.db.deleteTemplate(docId);
    this.presentToast('Template deleted', 2000);
  }

  ngOnInit() {
    this.db.getAllTemplates().then(templates => (this.templates$ = templates));
  }

  ngOnDestroy() {}
}
