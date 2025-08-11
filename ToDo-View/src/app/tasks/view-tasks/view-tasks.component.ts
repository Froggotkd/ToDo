import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TasksService, Tasks } from '../../../services/tasks-service';
import { TaskCardComponent } from "../task-card/task-card.component";
import { MatCard } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-view-tasks',
  imports: [TaskCardComponent, MatCard, MatIconModule, RouterLink],
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
  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getTasks().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }


}

