import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TasksService, Tasks } from '../../../services/tasks-service';
import { TaskCardComponent } from "../task-card/task-card.component";
import { MatCard } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-tasks',
  imports: [TaskCardComponent, MatCard, MatIconModule],
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css'],
  providers: [TasksService],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class ViewTasksComponent implements OnInit {
  tasks: Tasks[] = [];
  isEmpty = true;
  isEdit: any;
  constructor(private tasksService: TasksService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getTasks().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  openTaskDialog(task?: any): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: {
        isEdit: !!task,  
        task: task       
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isEdit) {
          // Lógica para actualizar la tarea
        } else {
          // Lógica para crear nueva tarea
        }
      }
    });

  }
}
