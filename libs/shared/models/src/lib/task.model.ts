export type SortDirection = 'asc' | 'desc';

export type SortOption = 'alphabetical' | 'dueDate' | 'state';
export interface Task {
    createdAt: Date;
    description?: string;
    dueDate: Date | null;
    id: string;
    isCompleted: boolean;
    isImportant: boolean;
    title: string;
    updatedAt: Date;
}
export interface TaskFilter {
    searchTerm: string;
    sortBy: SortOption;
    sortDirection: SortDirection;
}

export type TaskState = 'closed' | 'open';

export function createTask(partial: Partial<Task>): Task {
    const now = new Date();
    return {
        createdAt: now,
        description: '',
        dueDate: null,
        id: crypto.randomUUID(),
        isCompleted: false,
        isImportant: false,
        title: '',
        updatedAt: now,
        ...partial,
    };
}
