import { TestBed } from '@angular/core/testing';

import { TaskStore } from './task-store';
import { TaskStorage } from '@reminder/persistence';

describe('TaskStore', () => {
    let store: TaskStore;
    let mockStorage: jest.Mocked<TaskStorage>;

    beforeEach(() => {
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        mockStorage = {
            load: jest.fn().mockReturnValue([]),
            save: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<TaskStorage>;

        TestBed.configureTestingModule({
            providers: [
                TaskStore,
                { provide: TaskStorage, useValue: mockStorage },
            ],
        });

        store = TestBed.inject(TaskStore);
    });

    describe('initialization', () => {
        it('should be created', () => {
            expect(store).toBeTruthy();
        });

        it('should load tasks from storage on init', () => {
            expect(mockStorage.load).toHaveBeenCalledWith('tasks', []);
        });
    });

    describe('addTask', () => {
        it('should add a new task with default values', () => {
            const task = store.addTask({ title: 'Test Task' });

            expect(task.title).toBe('Test Task');
            expect(task.id).toBeDefined();
            expect(task.isCompleted).toBe(false);
            expect(task.isImportant).toBe(false);
            expect(store.tasks().length).toBe(1);
        });

        it('should add a task with custom values', () => {
            const dueDate = new Date('2026-02-01');
            const task = store.addTask({
                title: 'Custom Task',
                description: 'A description',
                dueDate,
                isImportant: true,
            });

            expect(task.title).toBe('Custom Task');
            expect(task.description).toBe('A description');
            expect(task.dueDate).toEqual(dueDate);
            expect(task.isImportant).toBe(true);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', () => {
            const task = store.addTask({ title: 'Original' });

            store.updateTask(task.id, { title: 'Updated' });

            expect(store.tasks()[0].title).toBe('Updated');
        });

        it('should update the updatedAt timestamp', () => {
            const task = store.addTask({ title: 'Test' });
            const originalUpdatedAt = task.updatedAt;

            // Wait a bit to ensure different timestamp
            store.updateTask(task.id, { title: 'Updated' });

            expect(store.tasks()[0].updatedAt.getTime()).toBeGreaterThanOrEqual(
                originalUpdatedAt.getTime()
            );
        });
    });

    describe('deleteTask', () => {
        it('should remove a task', () => {
            const task = store.addTask({ title: 'To Delete' });
            expect(store.tasks().length).toBe(1);

            store.deleteTask(task.id);

            expect(store.tasks().length).toBe(0);
        });

        it('should clear selection if deleted task was selected', () => {
            const task = store.addTask({ title: 'Selected Task' });
            store.selectTask(task.id);
            expect(store.selectedTask()).toBeTruthy();

            store.deleteTask(task.id);

            expect(store.selectedTask()).toBeNull();
        });
    });

    describe('toggleComplete', () => {
        it('should toggle task completion status', () => {
            const task = store.addTask({ title: 'Test' });
            expect(store.tasks()[0].isCompleted).toBe(false);

            store.toggleComplete(task.id);
            expect(store.tasks()[0].isCompleted).toBe(true);

            store.toggleComplete(task.id);
            expect(store.tasks()[0].isCompleted).toBe(false);
        });
    });

    describe('toggleImportant', () => {
        it('should toggle task importance', () => {
            const task = store.addTask({ title: 'Test' });
            expect(store.tasks()[0].isImportant).toBe(false);

            store.toggleImportant(task.id);
            expect(store.tasks()[0].isImportant).toBe(true);

            store.toggleImportant(task.id);
            expect(store.tasks()[0].isImportant).toBe(false);
        });
    });

    describe('filtering', () => {
        beforeEach(() => {
            store.addTask({ title: 'Buy groceries', description: 'Milk and eggs' });
            store.addTask({ title: 'Call mom' });
            store.addTask({ title: 'Write report' });
        });

        it('should filter by search term in title', () => {
            store.setSearchTerm('groceries');

            expect(store.filteredTasks().length).toBe(1);
            expect(store.filteredTasks()[0].title).toBe('Buy groceries');
        });

        it('should filter by search term in description', () => {
            store.setSearchTerm('Milk');

            expect(store.filteredTasks().length).toBe(1);
            expect(store.filteredTasks()[0].title).toBe('Buy groceries');
        });

        it('should be case insensitive', () => {
            store.setSearchTerm('CALL');

            expect(store.filteredTasks().length).toBe(1);
            expect(store.filteredTasks()[0].title).toBe('Call mom');
        });

        it('should return all tasks when search term is empty', () => {
            store.setSearchTerm('');

            expect(store.filteredTasks().length).toBe(3);
        });
    });

    describe('sorting', () => {
        beforeEach(() => {
            store.addTask({ title: 'Zebra task', dueDate: new Date('2026-03-01') });
            store.addTask({ title: 'Apple task', dueDate: new Date('2026-01-15') });
            store.addTask({ title: 'Mango task', dueDate: null });
        });

        it('should sort by due date (asc)', () => {
            store.setSortBy('dueDate');
            store.setSortDirection('asc');

            const tasks = store.filteredTasks();
            expect(tasks[0].title).toBe('Apple task');
            expect(tasks[1].title).toBe('Zebra task');
            expect(tasks[2].title).toBe('Mango task'); // null dates go last
        });

        it('should sort alphabetically (asc)', () => {
            store.setSortBy('alphabetical');
            store.setSortDirection('asc');

            const tasks = store.filteredTasks();
            expect(tasks[0].title).toBe('Apple task');
            expect(tasks[1].title).toBe('Mango task');
            expect(tasks[2].title).toBe('Zebra task');
        });

        it('should sort by state (open before closed)', () => {
            store.toggleComplete(store.tasks()[0].id); // Complete 'Zebra task'
            store.setSortBy('state');
            store.setSortDirection('asc');

            const tasks = store.filteredTasks();
            expect(tasks[0].isCompleted).toBe(false);
            expect(tasks[2].isCompleted).toBe(true);
        });

        it('should toggle sort direction', () => {
            store.setSortBy('alphabetical');
            store.setSortDirection('asc');
            expect(store.filter().sortDirection).toBe('asc');

            store.toggleSortDirection();
            expect(store.filter().sortDirection).toBe('desc');

            store.toggleSortDirection();
            expect(store.filter().sortDirection).toBe('asc');
        });

        it('should reverse order when sort direction is desc', () => {
            store.setSortBy('alphabetical');
            store.setSortDirection('desc');

            const tasks = store.filteredTasks();
            expect(tasks[0].title).toBe('Zebra task');
            expect(tasks[2].title).toBe('Apple task');
        });
    });

    describe('stats', () => {
        it('should compute correct stats', () => {
            store.addTask({ title: 'Task 1' });
            store.addTask({ title: 'Task 2', isImportant: true });
            store.addTask({ title: 'Task 3', dueDate: new Date('2020-01-01') }); // overdue

            store.toggleComplete(store.tasks()[0].id);

            const stats = store.stats();
            expect(stats.total).toBe(3);
            expect(stats.completed).toBe(1);
            expect(stats.open).toBe(2);
            expect(stats.important).toBe(1);
            expect(stats.overdue).toBe(1); // Task 3 is overdue and not completed
        });
    });

    describe('selection', () => {
        it('should select and deselect a task', () => {
            const task = store.addTask({ title: 'Selectable' });

            store.selectTask(task.id);
            expect(store.selectedTask()?.id).toBe(task.id);

            store.selectTask(null);
            expect(store.selectedTask()).toBeNull();
        });
    });
});
