import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public tasks: Task[];
  public task: Task;
  public formReset = new BehaviorSubject<boolean>(false);

  constructor() {}

  public resetTodoForm(reset: boolean) {
    return this.formReset.next(reset);
  }

  public getTasks() {
    this.tasks = this.getLocalStorage();
    return this.tasks;
  }

  public getCompletedTasks() {
    let completedTasks = [];
    this.tasks = this.getLocalStorage();
    if (this.tasks != null || this.tasks != undefined) {
      this.tasks.forEach((item: Task) => {
        completedTasks.push(item);
      });
    }
    this.setLocalStorage(completedTasks);
    return completedTasks;
  }

  public addTask(task) {
    let tasks = this.getLocalStorage();
    if (this.tasks === null || this.tasks === undefined) {
      tasks = [];
    }
    tasks.push(task);
    this.setLocalStorage(tasks);
  }

  public deleteTask(id) {
    let tasks = this.getLocalStorage();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        tasks.splice(i, 1);
      }
    }
    this.setLocalStorage(tasks);
  }

  public updateTask(oldTask, newTask) {
    let tasks = this.getLocalStorage();

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == oldTask.id) {
        tasks[i] = newTask;
      }
    }
    this.setLocalStorage(tasks);
  }

  private setLocalStorage(tasks) {
    localStorage.setItem('todoListAngular', JSON.stringify(tasks));
  }

  private getLocalStorage() {
    return JSON.parse(localStorage.getItem('todoListAngular'));
  }
}
