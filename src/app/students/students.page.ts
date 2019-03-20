import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from './student.model';
import { StudentsService } from './students.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'students.page.html',
  styleUrls: ['students.page.scss'],
})
export class StudentsPage implements OnInit, OnDestroy {
  students: Student[];
  isLoading = false;
  private studentsSub: Subscription;

  constructor(private studentsService: StudentsService,
    private router: Router) {
  }

  ngOnInit() {
    this.studentsSub = this.studentsService.students.subscribe(students => {
      this.students = students;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.studentsService.fetchStudents().subscribe(() => {
      this.isLoading = false;
    });
  }

  goToStudentDetail(studentId: string) {
    this.router.navigateByUrl(this.router.url + '/' + studentId)
  }

  addNewStudent() {
    this.router.navigateByUrl(this.router.url + '/new')
  }

  ngOnDestroy() {
    if (this.studentsSub) {
      this.studentsSub.unsubscribe();
    }
  }
}
