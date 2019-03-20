import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'students',
    children: [
      {
        path: '',
        loadChildren: './students/students.module#StudentsPageModule'
      },
      {
        path: 'new',
        loadChildren: './students/new-student/new-student.module#NewStudentPageModule'
      },
      {
        path: ':studentId',
        children: [
          {
            path: '',
            loadChildren: './students/student-detail/student-detail.module#StudentDetailPageModule'
          },
          {
            path: 'edit',
            loadChildren: './students/student-detail/edit-student/edit-student.module#EditStudentPageModule'
          },
          {
            path: 'new-mark',
            loadChildren: './marks/new-mark/new-mark.module#NewMarkPageModule'
          },
          {
            path: ':markId',
            loadChildren: './marks/edit-mark/edit-mark.module#EditMarkPageModule'
          }
        ]
      }
    ]
  },
  {
    path: 'subjects',
    children: [
      {
        path: '',
        loadChildren: './subjects/subjects.module#SubjectsPageModule'
      },
      {
        path: 'new',
        loadChildren: './subjects/new-subject/new-subject.module#NewSubjectPageModule'
      },
      {
        path: ':subjectId',
        children: [
          {
            path: '',
            loadChildren: './subjects/subject-detail/subject-detail.module#SubjectDetailPageModule'
          },
          {
            path: 'edit',
            loadChildren: './subjects/subject-detail/edit-subject/edit-subject.module#EditSubjectPageModule'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
