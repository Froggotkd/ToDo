import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';

export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  completado: boolean;
}

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
  animations: [
    trigger('cardAnimation', [
      state('active', style({
        backgroundColor: 'rgba(255, 255, 255, 1)'
      })),
      state('completed', style({
        backgroundColor: 'rgba(245, 245, 245, 0.7)'
      })),
      transition('active <=> completed', [
        animate('0.3s ease-in-out')
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.2s ease-out')
      ])
    ])
  ]
})
export class TaskCardComponent {

  @Input() id: number = 0;
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() completado: boolean = false;

  constructor(private dialog: MatDialog) { }

  openTaskDialog(id: number, titulo: string, descripcion: string, completado: boolean): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: {
        task: {
          id: id,
          title: titulo,
          description: descripcion,
          isCompleted: completado
        }
      }
    });
  }
}
