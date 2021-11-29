import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoFormComponent } from './todo-form/todo-form.component';

@NgModule({
  declarations: [TodoFormComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  exports: [TodoFormComponent, FormsModule, ReactiveFormsModule, CommonModule],
})
export class SharedModule {}
