import { Component, OnInit, OnDestroy } from '@angular/core';
import { Mark } from '../mark.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MarksService } from '../marks.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-mark',
  templateUrl: './edit-mark.page.html',
  styleUrls: ['./edit-mark.page.scss'],
})
export class EditMarkPage implements OnInit, OnDestroy {
  loadedMark: Mark;
  markId: string;
  isLoading = false;
  private markSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private marksService: MarksService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('markId') || !paramMap.has('studentId')) {
        // redirect
        this.router.navigate(['/students']);
        return;
      }
      this.markId = paramMap.get('markId');
      this.isLoading = true;
      this.markSub = this.marksService
        .getMark(paramMap.get('markId'))
        .subscribe(mark => {
          this.loadedMark = mark;
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Mark could not be fetched. Please try again later.',
            buttons: [{text: 'Okay', handler: () => {
              this.router.navigate(['/students']);
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
      message: 'Updating mark...'
    }).then(loadingEl => {
      this.marksService.updateMark(this.loadedMark.id, this.loadedMark.studentId, this.loadedMark.subjectId, form.value.mark
        ).subscribe(() => {
          loadingEl.dismiss();
          form.reset();
          this.router.navigate(['/students/' + this.loadedMark.studentId]);
        })
    });
  }

  deleteMark(markId: string) {
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you want to delete the mark?',
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
              this.marksService.deleteMark(markId).subscribe(() => {
                loadingEl.dismiss();
              });
            });

            this.router.navigate(['/students/' + this.loadedMark.studentId]);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.markSub) {
      this.markSub.unsubscribe();
    }
  }
}
