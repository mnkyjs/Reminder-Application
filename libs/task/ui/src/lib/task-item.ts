import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
    lucideCalendar,
    lucideCheck,
    lucidePencil,
    lucideStar,
    lucideTrash2,
} from '@ng-icons/lucide';
import { Task } from '@reminder/models';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
    selector: 'ra-task-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...HlmButtonImports, ...HlmIconImports],
    providers: [
        provideIcons({
            lucideCheck,
            lucideCalendar,
            lucideStar,
            lucidePencil,
            lucideTrash2,
        }),
    ],
    host: {
        class: 'block',
        '[class.opacity-60]': 'task().isCompleted',
    },
    templateUrl: './task-item.html',
    styleUrl: './task-item.css',
})
export class TaskItem {
    readonly task = input.required<Task>();

    readonly toggleComplete = output<string>();
    readonly toggleImportant = output<string>();
    readonly edit = output<Task>();
    readonly delete = output<string>();

    protected readonly isOverdue = computed(() => {
        const task = this.task();
        return task.dueDate && !task.isCompleted && task.dueDate < new Date();
    });

    protected readonly formattedDate = computed(() => {
        const date = this.task().dueDate;
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        });
    });
}
