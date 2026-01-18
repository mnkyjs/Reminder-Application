import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowDownAZ, lucideArrowUpAZ, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { TaskStore } from '@reminder/data-access';
import { TaskForm } from '@reminder/feature-edit';
import { SortOption, Task } from '@reminder/models';
import { TaskItem } from '@reminder/ui';
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
    protected readonly deleteDialogOpen = signal(false);
    protected readonly deleteId = signal<null | string>(null);
    protected readonly editingTask = signal<null | Task>(null);

    protected readonly showForm = signal(false);

    protected readonly sortOptions: { label: string; value: SortOption }[] = [
        { label: 'Due Date', value: 'dueDate' },
        { label: 'Alphabetical', value: 'alphabetical' },
        { label: 'State', value: 'state' },
    ];
    protected readonly store = inject(TaskStore);

    protected closeForm(): void {
        this.showForm.set(false);
        this.editingTask.set(null);
    }

    protected confirmDelete(): void {
        const id = this.deleteId();
        if (id) {
            this.store.deleteTask(id);
        }
        this.deleteDialogOpen.set(false);
        this.deleteId.set(null);
    }

    protected deleteTask(id: string): void {
        this.deleteId.set(id);
        this.deleteDialogOpen.set(true);
    }

    protected onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.store.setSearchTerm(input.value);
    }

    protected onSortChange(value: SortOption): void {
        this.store.setSortBy(value);
    }

    protected openCreateForm(): void {
        this.editingTask.set(null);
        this.showForm.set(true);
    }

    protected openEditForm(task: Task): void {
        this.editingTask.set(task);
        this.showForm.set(true);
    }
}
