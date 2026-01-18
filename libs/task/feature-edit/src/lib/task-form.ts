import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { TaskStore } from '@reminder/data-access';
import { Task } from '@reminder/models';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
    selector: 'ra-task-form',
    imports: [ReactiveFormsModule, ...HlmButtonImports, ...HlmCardImports, ...HlmIconImports, ...HlmInputImports, ...HlmLabelImports],
    styleUrl: './task-form.css',
    templateUrl: './task-form.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideIcons({ lucideX })],
})
export class TaskForm implements OnInit {
    readonly close = output<void>();
    readonly task = input<null | Task>(null);

    private readonly fb = inject(FormBuilder);
    protected readonly form = this.fb.nonNullable.group({
        description: [''],
        dueDate: [''],
        isImportant: [false],
        title: ['', [Validators.required, Validators.minLength(1)]],
    });

    protected readonly isEditMode = computed(() => this.task() !== null);
    protected readonly title = computed(() => (this.isEditMode() ? 'Edit Task' : 'Create Task'));

    private readonly store = inject(TaskStore);

    ngOnInit(): void {
        const task = this.task();
        if (task) {
            this.form.patchValue({
                description: task.description ?? '',
                dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
                isImportant: task.isImportant,
                title: task.title,
            });
        }
    }

    protected onCancel(): void {
        this.close.emit();
    }

    protected onSubmit(): void {
        if (this.form.invalid) return;

        const { description, dueDate, isImportant, title } = this.form.getRawValue();
        const taskData = {
            description: description.trim() || undefined,
            dueDate: dueDate ? new Date(dueDate) : null,
            isImportant,
            title: title.trim(),
        };

        const existingTask = this.task();
        if (existingTask) {
            this.store.updateTask(existingTask.id, taskData);
        } else {
            this.store.addTask(taskData);
        }

        this.close.emit();
    }

    private formatDateForInput(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
