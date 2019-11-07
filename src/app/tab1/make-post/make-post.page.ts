import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DatabaseService, Template } from 'src/app/services/database.service';

import { take, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-make-post',
  templateUrl: './make-post.page.html',
  styleUrls: ['./make-post.page.scss']
})
export class MakePostPage implements OnInit {
  body: string;
  template$: Observable<Template>;

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private toastController: ToastController
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

  copyPostHandler(textarea) {
    const el = document.createElement('textarea');
    el.value = textarea.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.presentToast('Post copied to clipboard!', 2000);
  }

  ngOnInit() {
    this.template$ = this.route.params.pipe(
      take(1),
      switchMap(params => {
        return this.db.getTemplate(params['id']);
      }),
      switchMap(template$ => template$)
    );
  }
}
