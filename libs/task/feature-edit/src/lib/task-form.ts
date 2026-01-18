import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        ...HlmButtonImports,
        ...HlmCardImports,
        ...HlmIconImports,
        ...HlmInputImports,
        ...HlmLabelImports,
    ],
    providers: [provideIcons({ lucideX })],
    templateUrl: './task-form.html',
    styleUrl: './task-form.css',
})
export class TaskForm {
    readonly task = input<Task | null>(null);
    readonly close = output<void>();

    private readonly fb = inject(FormBuilder);
    private readonly store = inject(TaskStore);

    protected readonly isEditMode = computed(() => this.task() !== null);
    protected readonly title = computed(() => (this.isEditMode() ? 'Edit Task' : 'Create Task'));

    protected readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(1)]],
        description: [''],
        dueDate: [''],
        isImportant: [false],
    });

    ngOnInit(): void {
        const task = this.task();
        if (task) {
            this.form.patchValue({
                title: task.title,
                description: task.description ?? '',
                dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
                isImportant: task.isImportant,
            });
        }
    }

    protected onSubmit(): void {
        if (this.form.invalid) return;

        const { title, description, dueDate, isImportant } = this.form.getRawValue();
        const taskData = {
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate ? new Date(dueDate) : null,
            isImportant,
        };

        const existingTask = this.task();
        if (existingTask) {
            this.store.updateTask(existingTask.id, taskData);
        } else {
            this.store.addTask(taskData);
        }

        this.close.emit();
    }

    protected onCancel(): void {
        this.close.emit();
    }

    private formatDateForInput(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
