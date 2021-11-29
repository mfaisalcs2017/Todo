import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';

export interface TodoFormValues {
  todoItem: string;
}

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TodoFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TodoFormComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  public todoFormGroup: FormGroup;
  public subscriptions: Subscription[] = [];
  @Input() public todo;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {}

  public ngOnInit(): void {
    this.initializeTodoForm();
    this.resetForm();
    if (this.todo) {
      this.todoFormGroup.get('todoItem').patchValue(this.todo?.name);
    }
  }

  public resetForm(): void {
    this.taskService.formReset.subscribe((reset: Boolean) => {
      if (reset) {
        this.todoFormGroup.reset();
        this.todoFormGroup.markAsUntouched();
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public onChange: any = () => {};
  public onTouched: any = () => {};

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public writeValue(value) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.todoFormGroup.reset();
    }
  }

  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  get value(): TodoFormValues {
    return this.todoFormGroup.value;
  }

  set value(value: TodoFormValues) {
    this.todoFormGroup.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get todoItem(): AbstractControl {
    return this.todoFormGroup.controls.todoItem;
  }

  public initializeTodoForm() {
    this.todoFormGroup = this.formBuilder.group({
      todoItem: [null, [Validators.required, Validators.minLength(2)]],
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.todoFormGroup.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  // communicate the inner form validation to the parent form
  public validate(_: FormControl) {
    if (this.todoFormGroup.valid) {
      return null;
    } else if (this.todoItem?.errors?.required) {
      return { todoItem: { valid: { required: true } } };
    } else if (this.todoItem?.errors?.minlength) {
      return { todoItem: { valid: { minLength: true } } };
    } else {
      return { todoItem: { valid: true } };
    }
  }
}
