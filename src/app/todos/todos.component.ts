import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';

import { EditTodoDialogComponent } from '../edit-todo-dialog/edit-todo-dialog.component';
import { TaskService } from '../shared/task.service';
import { Task } from '../shared/task';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  public completedTasks: Task[];
  public currentTasks: Task[];
  public todoFormGroup: FormGroup;
  constructor(
    private dialog: MatDialog,
    public taskService: TaskService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.initializeTodoForm();
    this.getTodos();
    this.cdr.detectChanges();
  }

  get todoItem(): AbstractControl {
    return this.todoFormGroup.controls.todoItem;
  }

  public getTodos() {
    this.completedTasks = this.taskService.getCompletedTasks();
  }

  public initializeTodoForm(): void {
    this.todoFormGroup = this.formBuilder.group({
      todoItem: [''],
    });
  }

  public onFormSubmit(): void {
    if (this.todoItem.invalid) {
      return this.validateAllFields(this.todoFormGroup);
    } else {
      let newTodo = {
        id: uuid(),
        done: false,
        name: this.todoFormGroup.value.todoItem.todoItem,
      };
      this.taskService.addTask(newTodo);
      this.getTodos();
      this.todoFormGroup.reset();
      this.taskService.resetTodoForm(true);
      this.todoFormGroup.markAsUntouched();
    }
  }

  public validateAllFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  public toggleCompleted(todo: Task) {
    todo.done = !todo.done;
    this.taskService.updateTask(todo, todo);
  }

  public editTodo(todo: Task) {
    let dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '700px',
      data: todo,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.updateTask(todo, result);
      }
    });
  }

  public deleteTodo(todo: Task) {
    for (let i = 0; i < this.completedTasks.length; i++) {
      if (this.completedTasks[i].id == todo.id) {
        this.completedTasks.splice(i, 1);
      }
    }
    this.taskService.deleteTask(todo.id);
  }
}
