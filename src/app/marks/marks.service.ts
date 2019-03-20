import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { Mark } from './mark.model';

interface MarkData {
  studentId: string;
  subjectId: string;
  marks: number[];
}

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private _marks = new BehaviorSubject<Mark[]>([]);

  get marks() {
    return this._marks.asObservable();
  }

  constructor(
    private http: HttpClient) { }

  fetchMarks(studentId: string) {
    return this.http
    .get<{ [key: string]: MarkData }>(`https://school-grading.firebaseio.com/marks.json?orderBy="studentId"&equalTo="${studentId}"`)
    .pipe(
      map(resData => {
        const marks = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            marks.push(new Mark(key, resData[key].studentId, resData[key].subjectId, resData[key].marks));
          }
        }
        return marks;
      }),
      tap(marks => {
        this._marks.next(marks);
      })
    );
  }

  fetchMarksWithSubject(studentId: string) {
    this.fetchMarks(studentId);
  }

  getMark(id: string) {
    return this.http.get<MarkData>(`https://school-grading.firebaseio.com/marks/${id}.json`)
      .pipe(
        map(markData => {
          return new Mark(id, markData.studentId, markData.subjectId, markData.marks);
        })
      );
  }

  addMark(studentId: string, subjectId: string, mark: number) {
    let generatedId: string;
    const newMark = new Mark (
      Math.random().toString(),
      studentId,
      subjectId,
      [mark]
    );
    return this.http
    .post<{name: string}>('https://school-grading.firebaseio.com/marks.json', { ...newMark, id: null })
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.marks;
      }),
      take(1),
      tap(marks => {
        newMark.id = generatedId;
        this._marks.next(marks.concat(newMark));
      })
    );
  }

  updateMark(markId: string, studentId: string, subjectId: string, mark: number) {
    let updatedMarks: Mark[];
    return this.marks.pipe(
      take(1),switchMap(marks => {
        if (!marks || marks.length <= 0) {
          return this.fetchMarks(studentId);
        } else {
          return of(marks);
        }
      }),
      switchMap(marks => {
        const updatedMarkIndex = marks.findIndex(m => m.id === markId);
        updatedMarks = [...marks];
        const oldMark = updatedMarks[updatedMarkIndex];
        updatedMarks[updatedMarkIndex] = new Mark(oldMark.id, oldMark.studentId, oldMark.subjectId, [mark]);
      
        return this.http.put(
          `https://school-grading.firebaseio.com/marks/${markId}.json`,
          { ...updatedMarks[updatedMarkIndex], id: null}  
        );
      }),
      tap(() => {
        this._marks.next(updatedMarks);
      })
    );
  }

  deleteMark(markId: string) {
    return this.http
      .delete(`https://school-grading.firebaseio.com/marks/${markId}.json`)
      .pipe(
        switchMap(() => {
          return this.marks;
        }),
        take(1), 
        tap(marks => {
          this._marks.next(marks.filter(m => m.id !== markId));
      })
    );
  }
}
