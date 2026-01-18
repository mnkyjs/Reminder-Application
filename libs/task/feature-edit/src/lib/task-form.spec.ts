import { TaskStore } from '@reminder/data-access';
import { Task } from '@reminder/models';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { TaskForm } from './task-form';

describe('TaskForm', () => {
    let mockStore: { addTask: jest.Mock; updateTask: jest.Mock };

    beforeEach(() => {
        mockStore = {
            addTask: jest.fn(),
            updateTask: jest.fn(),
        };
    });

    const setup = async (
        inputValues: { task: null | Task } = {
            task: null,
        },
    ) => {
        const user = userEvent.setup();
        const { fixture } = await render(TaskForm, {
            providers: [{ provide: TaskStore, useValue: mockStore }],
            inputs: inputValues,
        });
        return { fixture, user };
    };

    it('should create a new task when valid form is submitted', async () => {
        const { user } = await setup();

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const importantCheckbox = screen.getByLabelText(/mark as important/i);
        const submitButton = screen.getByRole('button', { name: /create task/i });

        await user.type(titleInput, 'New Task Title');
        await user.type(descriptionInput, 'New Description');
        await user.click(importantCheckbox);

        expect(submitButton).toBeEnabled();

        await user.click(submitButton);

        expect(mockStore.addTask).toHaveBeenCalledTimes(1);
        expect(mockStore.addTask).toHaveBeenCalledWith({
            description: 'New Description',
            dueDate: null,
            isImportant: true,
            title: 'New Task Title',
        });
    });

    it('should update an existing task when valid form is submitted', async () => {
        const existingTask = {
            createdAt: new Date(),
            description: 'Old Description',
            dueDate: new Date('2023-01-01'),
            id: '123',
            isCompleted: false,
            isImportant: false,
            title: 'Old Title',
            updatedAt: new Date(),
        };

        const { user } = await setup({ task: existingTask });

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole('button', { name: /save changes/i });

        expect(titleInput).toHaveValue('Old Title');

        await user.clear(titleInput);
        await user.type(titleInput, 'Updated Title');

        await user.click(submitButton);

        expect(mockStore.updateTask).toHaveBeenCalledTimes(1);
        expect(mockStore.updateTask).toHaveBeenCalledWith('123', {
            description: 'Old Description',
            dueDate: expect.any(Date),
            isImportant: false,
            title: 'Updated Title',
        });
    });

    it('should not submit if required fields are missing', async () => {
        const { user } = await setup();

        const submitButton = screen.getByRole('button', { name: /create task/i });

        expect(submitButton).toBeDisabled();

        await user.click(submitButton);

        expect(mockStore.addTask).not.toHaveBeenCalled();
    });

    it('should emit cancel event when cancel button is clicked', async () => {
        const { fixture, user } = await setup();
        const cancelSpy = jest.spyOn(fixture.componentInstance.cancelEdit, 'emit');

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(cancelSpy).toHaveBeenCalledTimes(1);
    });
});
