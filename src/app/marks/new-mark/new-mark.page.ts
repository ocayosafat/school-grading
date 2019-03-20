import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'src/app/subjects/subject.model';
import { Subscription } from 'rxjs';
import { SubjectsService } from 'src/app/subjects/subjects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { MarksService } from '../marks.service';
import { StudentsService } from 'src/app/students/students.service';
import { Student } from 'src/app/students/student.model';

@Component({
  selector: 'app-new-mark',
  templateUrl: './new-mark.page.html',
  styleUrls: ['./new-mark.page.scss'],
})
export class NewMarkPage implements OnInit, OnDestroy {
  loadedSubjects: Subject[];
  loadedStudent: Student;
  isLoadingSubject = false;
  isLoadingStudent = false;
  studentId: string;
  private subjectsSub: Subscription;
  private studentSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectsService: SubjectsService,
    private studentsService: StudentsService,
    private marksService: MarksService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('studentId')) {
        // redirect
        this.router.navigate(['/students']);
        return;
      }
      this.studentId = paramMap.get('studentId');
      this.isLoadingStudent = true;
      this.isLoadingSubject = true;
      this.studentSub = this.studentsService.getStudent(paramMap.get('studentId')).subscribe(student => {
        this.loadedStudent = student;
        this.isLoadingStudent = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occured!',
          message: 'Student could not be fetched. Please try again later.',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/subjects']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
      this.subjectsSub = this.subjectsService.fetchSubjects().subscribe(subjects => {
        this.loadedSubjects = subjects;
        this.isLoadingSubject = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occured!',
          message: 'Subject could not be fetched. Please try again later.',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/subjects']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating mark...'
    }).then(loadingEl => {
      loadingEl.present();
      this.marksService.addMark(
        this.loadedStudent.id,
        form.value.subject,
        form.value.mark
      ).subscribe(() => {
        loadingEl.dismiss();
        form.reset();
        this.router.navigate(['/students/' + this.loadedStudent.id]);
      });
    });
  }

  ngOnDestroy() {
    if (this.subjectsSub) {
      this.subjectsSub.unsubscribe();
    }
    if (this.studentSub) {
      this.studentSub.unsubscribe();
    }
  }
}
