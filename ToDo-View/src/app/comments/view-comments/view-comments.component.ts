import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../../services/tasks-service';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NgFor, NgIf } from '@angular/common';
import { CommentsService } from '../../../services/comments-service';

export interface Tasks {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}
export interface Comments {
  id: number;
  comment: string;
  isUpdated: boolean;
}

@Component({
  selector: 'app-view-comments',
  imports: [MatIconModule, MatInputModule, NgIf, NgFor],
  templateUrl: './view-comments.component.html',
  styleUrl: './view-comments.component.css'
})
export class ViewCommentsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router,private tasksService: TasksService,private commentsService: CommentsService) { }
  taskId!: number;
  task: Tasks | null = null;
  comments: Comments[] = [];
  

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = Number(idParam);
      }else{
        this.router.navigate([''])
      }
      this.task = this.getTask(idParam? Number(idParam):0)
      this.comments = this.getCommentsFromTask(idParam? Number(idParam):0)
    });
  }

  getTask(id: number): Tasks {
    this.tasksService.getTask(id).subscribe({
      next: (data) => {
        this.task = {
          id: data.id,
          title: data.title,
          description: data.description,
          isCompleted: data.isCompleted
        };
      },error:(err)=>{this.router.navigate([''])}
    });
    return this.task!;
  }

  getCommentsFromTask(taskId:number): Comments[]{
    this.commentsService.getComments(taskId).subscribe({
      next: (data) => (this.comments = data),
      error: (err) => console.error('Error al cargar tareas', err)
    });
    return this.comments;
  }

}
