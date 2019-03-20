import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StudentsService } from '../students.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.page.html',
  styleUrls: ['./new-student.page.scss'],
})
export class NewStudentPage implements OnInit {

  constructor(private studentsService: StudentsService,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating student...'
    }).then(loadingEl => {
      loadingEl.present();
      this.studentsService.addStudent(
        form.value.firstname,
        form.value.lastname,
        form.value.classname,
        form.value.dob
        ).subscribe(() => {
          loadingEl.dismiss();
          form.reset();
          this.router.navigate(['/students']);
      });
    });
  }
}
