import { ChangeDetectionStrategy, Component, computed, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Task } from '@reminder/models';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { format } from 'date-fns';

@Component({
    selector: 'ra-task-form',
    imports: [ReactiveFormsModule, ...HlmButtonImports, ...HlmCardImports, ...HlmIconImports, ...HlmInputImports, ...HlmLabelImports],
    styleUrl: './task-form.css',
    templateUrl: './task-form.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideIcons({ lucideX })],
})
export class TaskForm implements OnInit {
    readonly task = input<null | Task>(null);
    protected readonly isEditMode = computed(() => this.task() !== null);
    protected readonly title = computed(() => (this.isEditMode() ? 'Edit Task' : 'Create Task'));

    readonly save = output<{
        description?: string;
        dueDate: Date | null;
        isImportant: boolean;
        title: string;
    }>();
    readonly cancelEdit = output<void>();

    protected readonly form = new FormGroup({
        description: new FormControl('', { nonNullable: true }),
        dueDate: new FormControl('', { nonNullable: true }),
        isImportant: new FormControl(false, { nonNullable: true }),
        title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
    });

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
        this.cancelEdit.emit();
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

        this.save.emit(taskData);
        this.cancelEdit.emit();
    }

    private formatDateForInput(date: Date): string {
        return format(date, 'yyyy-MM-dd');
    }
}
