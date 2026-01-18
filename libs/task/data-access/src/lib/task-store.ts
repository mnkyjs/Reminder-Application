import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { createTask, SortDirection, SortOption, Task, TaskFilter } from '@reminder/models';
import { TaskStorage } from '@reminder/persistence';

@Injectable({ providedIn: 'root' })
export class TaskStore {
    private readonly _filter = signal<TaskFilter>({
        searchTerm: '',
        sortBy: 'dueDate',
        sortDirection: 'asc',
    });
    readonly filter = this._filter.asReadonly();

    private readonly _tasks = signal<Task[]>([]);
    readonly filteredTasks = computed(() => {
        const tasks = this._tasks();
        const { searchTerm, sortBy, sortDirection } = this._filter();

        let result = tasks;
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = tasks.filter((task) => task.title.toLowerCase().includes(term) || task.description?.toLowerCase().includes(term));
        }

        result = [...result].sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'alphabetical':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) comparison = 0;
                    else if (!a.dueDate) comparison = 1;
                    else if (!b.dueDate) comparison = -1;
                    else comparison = a.dueDate.getTime() - b.dueDate.getTime();
                    break;
                case 'state':
                    comparison = Number(a.isCompleted) - Number(b.isCompleted);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    });
    private readonly _selectedTaskId = signal<null | string>(null);

    readonly selectedTask = computed(() => {
        const id = this._selectedTaskId();
        return id ? (this._tasks().find((task) => task.id === id) ?? null) : null;
    });

    readonly stats = computed(() => {
        const tasks = this._tasks();
        return {
            completed: tasks.filter((task) => task.isCompleted).length,
            important: tasks.filter((task) => task.isImportant).length,
            open: tasks.filter((task) => !task.isCompleted).length,
            overdue: tasks.filter((task) => task.dueDate && !task.isCompleted && task.dueDate < new Date()).length,
            total: tasks.length,
        };
    });

    readonly tasks = this._tasks.asReadonly();

    private readonly FILTER_STORAGE_KEY = 'task-filter';

    private readonly storage = inject(TaskStorage);
    private readonly STORAGE_KEY = 'tasks';

    constructor() {
        this._tasks.set(this.storage.load<Task[]>(this.STORAGE_KEY, []));

        const savedFilter = this.storage.load<null | Pick<TaskFilter, 'sortBy' | 'sortDirection'>>(this.FILTER_STORAGE_KEY, null);
        if (savedFilter) {
            this._filter.update((filter) => ({
                ...filter,
                sortBy: savedFilter.sortBy ?? filter.sortBy,
                sortDirection: savedFilter.sortDirection ?? filter.sortDirection,
            }));
        }

        effect(() => {
            const tasks = this._tasks();
            this.storage.save(this.STORAGE_KEY, tasks);
        });

        effect(() => {
            const filter = this._filter();
            this.storage.save(this.FILTER_STORAGE_KEY, {
                sortBy: filter.sortBy,
                sortDirection: filter.sortDirection,
            });
        });
    }

    addTask(taskData: Partial<Task>): Task {
        const newTask = createTask(taskData);
        this._tasks.update((tasks) => [...tasks, newTask]);
        return newTask;
    }

    deleteTask(id: string): void {
        this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
        if (this._selectedTaskId() === id) {
            this._selectedTaskId.set(null);
        }
    }

    selectTask(id: null | string): void {
        this._selectedTaskId.set(id);
    }

    setSearchTerm(term: string): void {
        this._filter.update((filter) => ({ ...filter, searchTerm: term }));
    }

    setSortBy(sortBy: SortOption): void {
        this._filter.update((filter) => ({ ...filter, sortBy }));
    }

    setSortDirection(direction: SortDirection): void {
        this._filter.update((filter) => ({ ...filter, sortDirection: direction }));
    }

    toggleComplete(id: string): void {
        this._tasks.update((tasks) =>
            tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() } : task)),
        );
    }

    toggleImportant(id: string): void {
        this._tasks.update((tasks) =>
            tasks.map((task) => (task.id === id ? { ...task, isImportant: !task.isImportant, updatedAt: new Date() } : task)),
        );
    }

    toggleSortDirection(): void {
        this._filter.update((filter) => ({
            ...filter,
            sortDirection: filter.sortDirection === 'asc' ? 'desc' : 'asc',
        }));
    }

    updateTask(id: string, updates: Partial<Task>): void {
        this._tasks.update((tasks) => tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)));
    }
}
