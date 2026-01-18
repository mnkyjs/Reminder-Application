import { Signal, signal } from '@angular/core';
import { TaskStore } from '@reminder/data-access';
import { SortOption, Task } from '@reminder/models';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { TaskList } from './task-list';

interface TaskStats {
    completed: number;
    important: number;
    open: number;
    overdue: number;
    total: number;
}

describe('TaskList', () => {
    let mockStore: {
        deleteTask: jest.Mock;
        filter: Signal<{ searchTerm: string; sortBy: SortOption; sortDirection: 'asc' | 'desc' }>;
        filteredTasks: Signal<Task[]>;
        setSearchTerm: jest.Mock;
        setSortBy: jest.Mock;
        stats: Signal<TaskStats>;
        toggleComplete: jest.Mock;
        toggleImportant: jest.Mock;
        toggleSortDirection: jest.Mock;
    };

    const tasksSignal = signal<Task[]>([]);
    const filterSignal = signal({ searchTerm: '', sortBy: 'dueDate' as SortOption, sortDirection: 'asc' as const });
    const statsSignal = signal<TaskStats>({ completed: 0, important: 0, open: 0, overdue: 0, total: 0 });

    beforeEach(() => {
        tasksSignal.set([]);
        filterSignal.set({ searchTerm: '', sortBy: 'dueDate', sortDirection: 'asc' });
        statsSignal.set({ completed: 0, important: 0, open: 0, overdue: 0, total: 0 });

        mockStore = {
            deleteTask: jest.fn(),
            filter: filterSignal,
            filteredTasks: tasksSignal,
            setSearchTerm: jest.fn(),
            setSortBy: jest.fn(),
            stats: statsSignal,
            toggleComplete: jest.fn(),
            toggleImportant: jest.fn(),
            toggleSortDirection: jest.fn(),
        };
    });

    const setup = async () => {
        const user = userEvent.setup();
        const { fixture } = await render(TaskList, {
            providers: [{ provide: TaskStore, useValue: mockStore }],
        });
        return { fixture, user };
    };

    it('should render correct stats', async () => {
        statsSignal.set({ completed: 5, important: 2, open: 10, overdue: 1, total: 15 });
        await setup();

        expect(screen.getByText('15 total')).toBeVisible();
        expect(screen.getByText('10 open')).toBeVisible();
        expect(screen.getByText('5 completed')).toBeVisible();
        expect(screen.getByText('1 overdue')).toBeVisible();
    });

    it('should display tasks', async () => {
        const task: Task = {
            createdAt: new Date(),
            description: 'Desc',
            dueDate: new Date(),
            id: '1',
            isCompleted: false,
            isImportant: false,
            title: 'My Task',
            updatedAt: new Date(),
        };
        tasksSignal.set([task]);
        await setup();

        expect(screen.getByText('My Task')).toBeVisible();
    });

    it('should show empty state when no tasks', async () => {
        tasksSignal.set([]);
        await setup();

        expect(screen.getByText('No tasks found')).toBeVisible();
        expect(screen.getByText('Create your first task')).toBeVisible();
    });

    it('should update search term on input', async () => {
        const { user } = await setup();

        const searchInput = screen.getByPlaceholderText('Search tasks...');
        await user.type(searchInput, 'hello');

        expect(mockStore.setSearchTerm).toHaveBeenCalledWith('hello');
    });

    it('should open create form when clicking add task', async () => {
        const { user } = await setup();

        const addBtn = screen.getByRole('button', { name: /add task/i });
        await user.click(addBtn);

        expect(screen.getByRole('heading', { name: 'Create Task' })).toBeVisible();
    });

    it('should confirm delete dialog', async () => {
        const task: Task = {
            createdAt: new Date(),
            description: '',
            dueDate: new Date(),
            id: '123',
            isCompleted: false,
            isImportant: false,
            title: 'To Delete',
            updatedAt: new Date(),
        };
        tasksSignal.set([task]);
        const { user } = await setup();

        const deleteBtn = screen.getByLabelText('Delete task');
        await user.click(deleteBtn);

        expect(screen.getByText('Delete Task?')).toBeVisible();

        const confirmBtn = screen.getByRole('button', { name: 'Delete' });
        await user.click(confirmBtn);

        expect(mockStore.deleteTask).toHaveBeenCalledWith('123');
        await waitFor(() => expect(screen.queryByText('Delete Task?')).not.toBeInTheDocument());
    });
});
