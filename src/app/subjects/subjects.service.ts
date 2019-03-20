import { Injectable } from '@angular/core';
import { Subject } from './subject.model';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface SubjectData {
  name: string;
  grade: number[];
}

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private _subjects = new BehaviorSubject<Subject[]>([]);

  get subjects() {
    return this._subjects.asObservable();
  }

  constructor(private http: HttpClient) {}

  fetchSubjects() {
    return this.http
      .get<{ [key: string]: SubjectData }>('https://school-grading.firebaseio.com/subjects.json')
      .pipe(
        map(resData => {
          const subjects = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              subjects.push(new Subject(key, resData[key].name, resData[key].grade));
            }
          }
        return subjects;
        }),
        tap(subjects => {
          this._subjects.next(subjects);
        })
      );
  }

  getSubject(id: string) {
    return this.http.get<SubjectData>(`https://school-grading.firebaseio.com/subjects/${id}.json`)
      .pipe(
        map(subjectData => {
          return new Subject(id, subjectData.name, subjectData.grade);
        })
      );
  }

  addSubject(name: string, minA: number, minB: number, minC: number, minD: number) {
    let generatedId: string;
    const newSubject = new Subject(
      Math.random().toString(),
      name,
      [minA, minB, minC, minD]);
    return this.http
      .post<{name: string}>('https://school-grading.firebaseio.com/subjects.json', { ...newSubject, id: null })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.subjects;
        }),
        take(1),
        tap(subjects => {
          newSubject.id = generatedId;
          this._subjects.next(subjects.concat(newSubject));
        })
      );
    // return this.subjects.pipe(take(1), delay(1000), tap(subjects => {
    //   this._subjects.next(subjects.concat(newSubject));
    // }));
  }

  updateSubject(subjectId: string, name: string, minA: number, minB: number, minC: number, minD: number) {
    let updatedSubjects: Subject[];
    return this.subjects.pipe(
      take(1),switchMap(subjects => {
        if (!subjects || subjects.length <= 0) {
          return this.fetchSubjects();
        } else {
          return of(subjects);
        }
      }),
      switchMap(subjects => {
        const updatedSubjectIndex = subjects.findIndex(sj => sj.id === subjectId);
        updatedSubjects = [...subjects];
        const oldSubject = updatedSubjects[updatedSubjectIndex];
        updatedSubjects[updatedSubjectIndex] = new Subject(oldSubject.id, name, [minA, minB, minC, minD]);
      
        return this.http.put(
          `https://school-grading.firebaseio.com/subjects/${subjectId}.json`,
          { ...updatedSubjects[updatedSubjectIndex], id: null }
          );
      }), 
      tap(() => {
        this._subjects.next(updatedSubjects);
      })
    );
  }

  deleteSubject(subjectId: string) {
    return this.http
      .delete(`https://school-grading.firebaseio.com/subjects/${subjectId}.json`)
      .pipe(
        switchMap(() => {
          return this.subjects;
        }),
        take(1), 
        tap(subjects => {
          this._subjects.next(subjects.filter(s => s.id !== subjectId));
      })
    );
  }
}
