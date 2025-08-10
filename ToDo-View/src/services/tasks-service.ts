import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

export interface Tasks {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}
@Injectable({
    providedIn: 'root'
})

export class TasksService{

  constructor(private httpClient: HttpClient){
  }

  getTasks():Observable<Tasks[]>{
    return this.httpClient.get<Tasks[]>('https://localhost:7243/api/Tasks').pipe(
      catchError((error) => {
        if(error.status === 404) {
          console.error('Tasks not found', error);
        }
        throw error;
      })
    )
  }
}