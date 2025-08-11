import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-task-card',
  imports: [CommonModule, MatCardModule,MatCheckboxModule,MatButtonModule,MatIconModule, MatDividerModule],
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

  @Output() toggleCompletado = new EventEmitter<string>();
  @Output() editar = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  onToggleCompletado() {
    this.toggleCompletado.emit(this.id.toString());
  }

  onEditar() {
    this.editar.emit(this.id.toString());
  }

  onEliminar() {
    this.eliminar.emit(this.id.toString());
  }
}
