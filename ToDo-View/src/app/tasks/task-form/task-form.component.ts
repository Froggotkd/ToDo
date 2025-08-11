import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {TasksService, Tasks} from '../../../services/tasks-service'

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  imports: [MatDialogContent, MatSlideToggleModule, MatIcon,MatFormFieldModule, ReactiveFormsModule, MatDialogModule, CommonModule, MatInputModule, MatIconModule]
})
export class TaskFormComponent  {
  taskForm: FormGroup;
  isEditMode: boolean;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Tasks },
    private taskService: TasksService
  ) {
    this.isEditMode = !!data.task;

    this.taskForm = this.fb.group({
      title: [data.task?.title ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [data.task?.description ?? '', [Validators.maxLength(500)]],
      isCompleted: [data.task?.isCompleted ?? false]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid|| this.isSubmitting) return;
    this.isSubmitting = true;
    const taskData: Tasks = {
      id: this.isEditMode ? this.data.task!.id : -1,
      ...this.taskForm.value
    };

    const request$ = this.isEditMode
      ? this.taskService.updateTask(taskData.id, taskData)
      : this.taskService.createTask(taskData);

    request$.subscribe({
      next: (savedTask: Tasks) => {
        this.dialogRef.close(savedTask);
        this.isSubmitting = true;
      },
      error: (error: Error) => {
        console.error('Error guardando tarea', error);
        this.isSubmitting = true;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
