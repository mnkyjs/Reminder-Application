import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowDownAZ, lucideArrowUpAZ, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { TaskStore } from '@reminder/data-access';
import { SortOption, Task } from '@reminder/models';
import { TaskForm, TaskItem } from '@reminder/ui';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';
import { BrnSelect, BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
    selector: 'ra-task-list',
    imports: [
        BrnAlertDialogContent,
        BrnSelect,
        FormsModule,
        TaskItem,
        TaskForm,
        ...HlmButtonImports,
        ...HlmIconImports,
        ...HlmInputImports,
        ...HlmSelectImports,
        ...HlmAlertDialogImports,
        ...BrnSelectImports,
    ],
    styleUrl: './task-list.css',
    templateUrl: './task-list.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideIcons({
            lucideArrowDownAZ,
            lucideArrowUpAZ,
            lucidePlus,
            lucideSearch,
        }),
    ],
})
export class TaskList {
    readonly store = inject(TaskStore);

    readonly deleteDialogOpen = signal(false);
    readonly deleteId = signal<null | string>(null);
    readonly editingTask = signal<null | Task>(null);
    readonly showForm = signal(false);

    readonly filter = this.store.filter;
    readonly stats = this.store.stats;
    readonly tasks = this.store.filteredTasks;

    readonly sortOptions: { label: string; value: SortOption }[] = [
        { label: 'Due Date', value: 'dueDate' },
        { label: 'Alphabetical', value: 'alphabetical' },
        { label: 'State', value: 'state' },
    ];

    closeForm(): void {
        this.showForm.set(false);
        this.editingTask.set(null);
    }

    confirmDelete(): void {
        const id = this.deleteId();
        if (id) {
            this.store.deleteTask(id);
        }
        this.deleteDialogOpen.set(false);
        this.deleteId.set(null);
    }

    deleteTask(id: string): void {
        this.deleteId.set(id);
        this.deleteDialogOpen.set(true);
    }

    onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.store.setSearchTerm(input.value);
    }

    onSortChange(value: SortOption): void {
        this.store.setSortBy(value);
    }

    openCreateForm(): void {
        this.editingTask.set(null);
        this.showForm.set(true);
    }

    openEditForm(task: Task): void {
        this.editingTask.set(task);
        this.showForm.set(true);
    }

    toggleComplete(id: string): void {
        this.store.toggleComplete(id);
    }

    toggleImportant(id: string): void {
        this.store.toggleImportant(id);
    }

    onSaveTask(taskData: {
        description?: string;
        dueDate: Date | null;
        isImportant: boolean;
        title: string;
    }): void {
        const existingTask = this.editingTask();
        if (existingTask) {
            this.store.updateTask(existingTask.id, taskData);
        } else {
            this.store.addTask(taskData);
        }
        this.closeForm();
    }

    protected toggleSortDirection(): void {
        this.store.toggleSortDirection();
    }
}
