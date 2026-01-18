import { Task } from '@reminder/models';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { TaskForm } from './task-form';

describe('TaskForm', () => {
    const setup = async (
        inputValues: { task: null | Task } = {
            task: null,
        },
    ) => {
        const user = userEvent.setup();
        const { fixture } = await render(TaskForm, {
            inputs: inputValues,
        });
        return { fixture, user };
    };

    it('should emit save event with task data when valid form is submitted (Create Mode)', async () => {
        const { fixture, user } = await setup();
        const saveSpy = jest.spyOn(fixture.componentInstance.save, 'emit');

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const importantCheckbox = screen.getByLabelText(/mark as important/i);
        const submitButton = screen.getByRole('button', { name: /create task/i });

        await user.type(titleInput, 'New Task Title');
        await user.type(descriptionInput, 'New Description');
        await user.click(importantCheckbox);

        expect(submitButton).toBeEnabled();

        await user.click(submitButton);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith({
            description: 'New Description',
            dueDate: null,
            isImportant: true,
            title: 'New Task Title',
        });
    });

    it('should emit save event with updated data when valid form is submitted (Edit Mode)', async () => {
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

        const { fixture, user } = await setup({ task: existingTask });
        const saveSpy = jest.spyOn(fixture.componentInstance.save, 'emit');

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole('button', { name: /save changes/i });

        expect(titleInput).toHaveValue('Old Title');

        await user.clear(titleInput);
        await user.type(titleInput, 'Updated Title');

        await user.click(submitButton);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith({
            description: 'Old Description',
            dueDate: expect.any(Date),
            isImportant: false,
            title: 'Updated Title',
        });
    });

    it('should not emit save event if required fields are missing', async () => {
        const { fixture, user } = await setup();
        const saveSpy = jest.spyOn(fixture.componentInstance.save, 'emit');

        const submitButton = screen.getByRole('button', { name: /create task/i });

        expect(submitButton).toBeDisabled();

        await user.click(submitButton);

        expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should emit cancel event when cancel button is clicked', async () => {
        const { fixture, user } = await setup();
        const cancelSpy = jest.spyOn(fixture.componentInstance.cancelEdit, 'emit');

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(cancelSpy).toHaveBeenCalledTimes(1);
    });
});
