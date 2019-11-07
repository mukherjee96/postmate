import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomePage implements OnInit {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  loginStatus: string = '';
  constructor(
    public auth: AuthService,
    private router: Router,
    public loadingController: LoadingController
  ) {}

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  async prev() {
    await this.slides.slidePrev();
  }

  async next() {
    await this.slides.slideNext();
  }

  async loginHandler() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    this.auth
      .googleSignin()
      .then(() => {
        this.loginStatus = '';
        this.router.navigate(['/']);
      })
      .catch(err => (this.loginStatus = err))
      .finally(() => loading.dismiss());
  }

  ngOnInit() {}
}
