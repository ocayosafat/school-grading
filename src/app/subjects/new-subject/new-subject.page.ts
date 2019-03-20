import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectsService } from '../subjects.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-subject',
  templateUrl: './new-subject.page.html',
  styleUrls: ['./new-subject.page.scss'],
})
export class NewSubjectPage implements OnInit {

  constructor(private subjectsService: SubjectsService,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating subject...'
    }).then(loadingEl => {
      loadingEl.present();
      this.subjectsService.addSubject(
        form.value.name,
        form.value.minA,
        form.value.minB,
        form.value.minC,
        form.value.minD
      ).subscribe(() => {
        loadingEl.dismiss();
        form.reset();
        this.router.navigate(['/subjects']);
      });
    });
  }
}
