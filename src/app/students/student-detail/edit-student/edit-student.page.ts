import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../../student.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../students.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.page.html',
  styleUrls: ['./edit-student.page.scss'],
})
export class EditStudentPage implements OnInit, OnDestroy {
  loadedStudent: Student;
  studentId: string;
  form: FormGroup;
  isLoading = false;
  private studentSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private studentsService: StudentsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('studentId')) {
        // redirect
        this.router.navigate(['/students']);
        return;
      }
      this.studentId = paramMap.get('studentId');
      this.isLoading = true;
      this.studentSub = this.studentsService.getStudent(paramMap.get('studentId')).subscribe(student => {
        this.loadedStudent = student;
        this.form = new FormGroup({
          firstname: new FormControl(this.loadedStudent.firstname, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          lastname: new FormControl(this.loadedStudent.lastname, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          classname: new FormControl(this.loadedStudent.classname, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          dob: new FormControl(this.loadedStudent.dob.toISOString(), {
            updateOn: 'blur',
            validators: [Validators.required]
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occured!', 
          message: 'Student could not be fetched. Please try again later.',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/students']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onUpdateStudent() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating student...'
    }).then(loadingEl => {
      loadingEl.present();
      this.studentsService.updateStudent(this.loadedStudent.id, this.form.value.firstname, this.form.value.lastname, this.form.value.classname, this.form.value.dob
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/students/' + this.loadedStudent.id]);
        });
    });
  }
  
  ngOnDestroy() {
    if (this.studentSub) {
      this.studentSub.unsubscribe();
    }
  }
}
