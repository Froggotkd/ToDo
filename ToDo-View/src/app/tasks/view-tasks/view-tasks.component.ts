import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TasksService, Tasks } from '../../../services/tasks-service';


@Component({
  selector: 'app-view-tasks',
  imports: [],
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css'],
  providers: [TasksService]
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
