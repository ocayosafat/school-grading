import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyC0EnIlBXrI9gWcZyAsaJ5__WVC1R2YO4U",
  authDomain: "school-grading.firebaseapp.com",
  databaseURL: "https://school-grading.firebaseio.com",
  projectId: "school-grading",
  storageBucket: "school-grading.appspot.com",
  messagingSenderId: "1002716204880"
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Students',
      url: '/students',
      icon: 'person'
    },
    {
      title: 'Subjects',
      url: '/subjects',
      icon: 'book'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
