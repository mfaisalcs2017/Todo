import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../shared/task';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  @Input() public todo: Task;

  @Output() todoClicked: EventEmitter<void> = new EventEmitter();
  @Output() editClicked: EventEmitter<void> = new EventEmitter();
  @Output() deleteClicked: EventEmitter<void> = new EventEmitter();

  constructor() {}

  public ngOnInit(): void {}

  public onTodoClicked() {
    this.todoClicked.emit();
  }

  public onEditClicked() {
    this.editClicked.emit();
  }

  public onDeleteClicked() {
    this.deleteClicked.emit();
  }
}
