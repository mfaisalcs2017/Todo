import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../shared/task';

@Component({
  selector: 'app-edit-todo-dialog',
  templateUrl: './edit-todo-dialog.component.html',
  styleUrls: ['./edit-todo-dialog.component.scss'],
})
export class EditTodoDialogComponent implements OnInit {
  public todoFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditTodoDialogComponent>,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public todo: Task
  ) {}

  public ngOnInit(): void {
    this.initializeTodoForm();
    this.cdr.detectChanges();
  }

  get todoItem(): AbstractControl {
    return this.todoFormGroup.controls.todoItem;
  }

  public initializeTodoForm(): void {
    this.todoFormGroup = this.formBuilder.group({
      todoItem: [''],
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public onFormSubmit() {
    if (this.todoItem.invalid) {
      return this.validateAllFields(this.todoFormGroup);
    }
    if (this.todoFormGroup.value.todoItem.todoItem) {
      this.todo.name = this.todoFormGroup.value.todoItem.todoItem;
    }
    this.dialogRef.close(this.todo);
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
}
