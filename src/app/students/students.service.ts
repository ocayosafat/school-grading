import { Injectable } from '@angular/core';
import { Student } from './student.model';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface StudentData {
  firstname: string;
  lastname: string;
  classname: string;
  dob: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private _students = new BehaviorSubject<Student[]>([]);

  get students() {
    return this._students.asObservable();
  }

  constructor(private http: HttpClient) {}

  fetchStudents() {
    return this.http
      .get<{ [key: string]: StudentData }>('https://school-grading.firebaseio.com/students.json')
      .pipe(
        map(resData => {
          const students = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              students.push(new Student(key, resData[key].firstname, resData[key].lastname, resData[key].classname, new Date (resData[key].dob)));
            }
          }
          return students;
        }),
        tap(students => {
          this._students.next(students);
        })
      );
  }

  getStudent(id: string) {
    return this.http.get<StudentData>(`https://school-grading.firebaseio.com/students/${id}.json`)
      .pipe(
        map(studentData => {
          return new Student(id, studentData.firstname, studentData.lastname, studentData.classname, new Date(studentData.dob));
        })
      );
  }

  addStudent(firstname: string, lastname: string, classname: string, dob: Date) {
    let generatedId: string;
    const newStudent = new Student(
      Math.random().toString(), 
      firstname, 
      lastname, 
      classname, 
      dob);
    return this.http
      .post<{name: string}>('https://school-grading.firebaseio.com/students.json', { ...newStudent, id: null })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.students;
        }),
        take(1),
        tap(students => {
          newStudent.id = generatedId;
          this._students.next(students.concat(newStudent));
        })
      );
    // return this.students.pipe(take(1), delay(1000), tap(students => { 
    //     this._students.next(students.concat(newStudent));
    // }));
  } 

  updateStudent(studentId: string, firstname: string, lastname: string, classname: string, dob: Date) {
    let updatedStudents: Student[];
    return this.students.pipe(
      take(1),switchMap(students => {
        if (!students || students.length <= 0) {
          return this.fetchStudents();
        } else {
          return of(students);
        }
      }),
      switchMap(students => {
        const updatedStudentIndex = students.findIndex(st => st.id === studentId);
        updatedStudents = [...students];
        const oldStudent = updatedStudents[updatedStudentIndex];
        updatedStudents[updatedStudentIndex] = new Student(oldStudent.id, firstname, lastname, classname, dob);
      
        return this.http.put(
          `https://school-grading.firebaseio.com/students/${studentId}.json`,
          { ...updatedStudents[updatedStudentIndex], id: null }
          );
      }), 
      tap(() => {
        this._students.next(updatedStudents);
      })
    );
  }

  deleteStudent(studentId: string) {
    return this.http
      .delete(`https://school-grading.firebaseio.com/students/${studentId}.json`)
      .pipe(
        switchMap(() => {
          return this.students;
        }),
        take(1),
        tap(students => {
          this._students.next(students.filter(s => s.id !== studentId));
      })
    );
  }
}
