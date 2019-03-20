import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../../subject.model';
import { Subscription } from 'rxjs';
import { SubjectsService } from '../../subjects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.page.html',
  styleUrls: ['./edit-subject.page.scss'],
})
export class EditSubjectPage implements OnInit, OnDestroy {
  loadedSubject: Subject;
  subjectId: string;
  form: FormGroup;
  isLoading = false;
  private subjectSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectsService: SubjectsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('subjectId')) {
        // redirect
        this.router.navigate(['/subjects']);
        return;
      }
      this.subjectId = paramMap.get('subjectId');
      this.isLoading = true;
      this.subjectSub = this.subjectsService.getSubject(paramMap.get('subjectId')).subscribe(subject => {
        this.loadedSubject = subject;
        this.form = new FormGroup({
          name: new FormControl(this.loadedSubject.name, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          minA: new FormControl(this.loadedSubject.grade[0], {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          minB: new FormControl(this.loadedSubject.grade[1], {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          minC: new FormControl(this.loadedSubject.grade[2], {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          minD: new FormControl(this.loadedSubject.grade[3], {
            updateOn: 'blur',
            validators: [Validators.required]
          })
        });
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

  onUpdateSubject() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating subject...'
    }).then(loadingEl => {
      loadingEl.present();
      this.subjectsService.updateSubject(this.loadedSubject.id, this.form.value.name, this.form.value.minA, this.form.value.minB, this.form.value.minC, this.form.value.minD
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/subjects/' + this.loadedSubject.id]);
        });
    });
  }

  ngOnDestroy() {
    if (this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
  }
}
