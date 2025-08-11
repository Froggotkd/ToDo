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

  private baseUrl = 'https://localhost:7243/api/Tasks'

  getTasks():Observable<Tasks[]>{
    return this.httpClient.get<Tasks[]>(this.baseUrl).pipe(
      catchError((error) => {
        if(error.status === 404) {
          console.error('Tasks not found', error);
        }
        throw error;
      })
    )
  }

  createTask(task: Tasks): Observable<Tasks> {
    return this.httpClient.post<Tasks>(this.baseUrl, task);
  }

  updateTask(id: number, task: Tasks): Observable<Tasks> {
    return this.httpClient.put<Tasks>(`${this.baseUrl}/${id}`, task);
  }
}