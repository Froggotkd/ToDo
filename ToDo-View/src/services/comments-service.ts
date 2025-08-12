import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

export interface Comments {
  id: number;
  comment: string;
  isUpdated: boolean;
}

export interface CommentsWrite {
  comment: string;
  isUpdated: boolean;
  parentId: number;
  taskId: number;
}

export interface CommentsUpdate {
  id: number;
  comment: string;
  isUpdated: boolean;
  parentId: number;
}

@Injectable({
  providedIn: 'root'
})

export class CommentsService {
  constructor(private httpClient: HttpClient) { }

  private baseUrl = 'https://localhost:7243/api/Comment'

  getComments(id: number): Observable<Comments[]> {
    return this.httpClient.get<Comments[]>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.error('Tasks not found', error);
        }
        throw error;
      }))
  }

  addComment(comment: CommentsWrite): Observable<CommentsWrite> {
    return this.httpClient.post<CommentsWrite>(this.baseUrl, comment);
  }

  updateComment(id: number, comment: CommentsUpdate): Observable<CommentsUpdate> {
    return this.httpClient.put<CommentsUpdate>(`${this.baseUrl}/${id}`, comment);
  }

  deleteComment(id: number):Observable<void>{
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        if(error.status === 404) {
          console.error('Comment not found', error);
        }
        throw error;
      })
    );
  }
}