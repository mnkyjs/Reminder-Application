import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideCheck, lucidePencil, lucideStar, lucideTrash2 } from '@ng-icons/lucide';
import { Task } from '@reminder/models';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
    selector: 'ra-task-item',
    imports: [NgClass, ...HlmButtonImports, ...HlmIconImports],
    styleUrl: './task-item.css',
    templateUrl: './task-item.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.opacity-60]': 'task().isCompleted',
        'class': 'block',
    },
    providers: [
        provideIcons({
            lucideCalendar,
            lucideCheck,
            lucidePencil,
            lucideStar,
            lucideTrash2,
        }),
    ],
})
export class TaskItem {
    readonly delete = output<string>();

    readonly edit = output<Task>();
    readonly task = input.required<Task>();
    readonly toggleComplete = output<string>();
    readonly toggleImportant = output<string>();

    protected readonly formattedDate = computed(() => {
        const date = this.task().dueDate;
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        });
    });

    protected readonly isOverdue = computed(() => {
        const task = this.task();
        return task.dueDate && !task.isCompleted && task.dueDate < new Date();
    });
}
