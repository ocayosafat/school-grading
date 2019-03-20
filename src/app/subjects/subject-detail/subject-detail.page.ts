import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../subject.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService } from '../subjects.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.page.html',
  styleUrls: ['./subject-detail.page.scss'],
})
export class SubjectDetailPage implements OnInit, OnDestroy {
  loadedSubject: Subject;
  subjectId: string;
  isLoading = false;
  private subjectSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectsService: SubjectsService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('subjectId')) {
        // redirect
        this.router.navigate(['/subjects']);
        return;
      }
      this.subjectId = paramMap.get('subjectId');
      this.isLoading = true;
      this.subjectSub = this.subjectsService
        .getSubject(paramMap.get('subjectId'))
        .subscribe(subject => {
          this.loadedSubject = subject;
          this.isLoading = false;
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

  editSubject() {
    this.router.navigateByUrl(this.router.url + '/edit');
  }

  deleteSubject(subjectId: string) {
    this.alertCtrl.create({
      header: 'Are you sure?', 
      message: 'Do you want to delete the subject?', 
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
              this.subjectsService.deleteSubject(subjectId).subscribe(() => {
                loadingEl.dismiss();
              });
            });

            this.router.navigate(['/subjects']);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
  }
}
