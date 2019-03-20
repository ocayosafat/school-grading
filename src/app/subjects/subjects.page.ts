import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from './subject.model';
import { SubjectsService } from './subjects.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: 'subjects.page.html',
  styleUrls: ['subjects.page.scss']
})
export class SubjectsPage implements OnInit, OnDestroy {
  subjects: Subject[];
  isLoading = false;
  private subjectsSub: Subscription;

  constructor(private subjectsService: SubjectsService,
    private router: Router) {}

  ngOnInit() {
    this.subjectsSub = this.subjectsService.subjects.subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.subjectsService.fetchSubjects().subscribe(() => {
      this.isLoading = false;
    });
  }

  goToSubjectDetail(subjectId: string) {
    this.router.navigateByUrl(this.router.url + '/' + subjectId)
  }

  addNewSubject() {
    this.router.navigateByUrl(this.router.url + '/new')
  }

  ngOnDestroy() {
    if (this.subjectsSub) {
      this.subjectsSub.unsubscribe();
    }
  }
}
