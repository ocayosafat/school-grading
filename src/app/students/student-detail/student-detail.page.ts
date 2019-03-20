import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../students.service';
import { Student } from '../student.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MarksService } from 'src/app/marks/marks.service';
import { Mark } from 'src/app/marks/mark.model';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.page.html',
  styleUrls: ['./student-detail.page.scss'],
})
export class StudentDetailPage implements OnInit, OnDestroy {
  loadedStudent: Student;
  loadedMarks: Mark[];
  studentId: string;
  isLoadingStudent = false;
  isLoadingMarks = false;
  options = { year: 'numeric', month: 'long', day: 'numeric' };
  private studentSub: Subscription;
  private markSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private studentsService: StudentsService,
    private marksService: MarksService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.ionViewWillEnter();
    this.markSub = this.marksService.marks.subscribe(marks => {
      this.loadedMarks = marks;
    })
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
      this.isLoadingMarks = true;
      this.studentSub = this.studentsService
        .getStudent(paramMap.get('studentId'))
        .subscribe(student => {
          this.loadedStudent = student;
          this.isLoadingStudent = false;
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
      this.markSub = this.marksService
        .fetchMarks(paramMap.get('studentId'))
        .subscribe(marks => {
          this.loadedMarks = marks;
          this.isLoadingMarks = false;
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

  editStudent() {
    this.router.navigateByUrl(this.router.url + '/edit');
  }

  deleteStudent(studentId: string) {
    this.alertCtrl.create({
      header: 'Are you sure?', 
      message: 'Do you want to delete the student?', 
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.loadingCtrl.create({message: 'Deleting...'}).then(loadingEl => {
              loadingEl.present();
              this.studentsService.deleteStudent(studentId).subscribe(() => {
                loadingEl.dismiss();
              });
            });
            
            this.router.navigate(['/students']);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  addNewMark() {
    this.router.navigateByUrl(this.router.url + '/new-mark');
  }

  editMark(markId: string) {
    this.router.navigateByUrl(this.router.url + '/' + markId)
  }

  ngOnDestroy() {
    if (this.studentSub) {
      this.studentSub.unsubscribe();
    }
    if (this.markSub) {
      this.markSub.unsubscribe();
    }
  }

}
