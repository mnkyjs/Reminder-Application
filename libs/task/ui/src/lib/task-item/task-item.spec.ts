import { Task } from '@reminder/models';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { TaskItem } from './task-item';

describe('TaskItem', () => {
    const defaultTask: Task = {
        createdAt: new Date(),
        description: 'Test Description',
        dueDate: new Date(),
        id: '1',
        isCompleted: false,
        isImportant: false,
        title: 'Test Task',
        updatedAt: new Date(),
    };

    const setup = async (inputValues: { task: Task } = { task: defaultTask }) => {
        const user = userEvent.setup();
        const { fixture } = await render(TaskItem, {
            inputs: inputValues,
        });
        return { fixture, user };
    };

    it('should render task details correctly', async () => {
        await setup();

        expect(screen.getByText('Test Task')).toBeVisible();
        expect(screen.getByText('Test Description')).toBeVisible();
    });

    it('should show completion status styling', async () => {
        const completedTask = { ...defaultTask, isCompleted: true };
        await setup({ task: completedTask });

        const title = screen.getByText('Test Task');
        expect(title).toHaveClass('line-through');
        expect(title).toHaveClass('text-muted-foreground');

        expect(screen.getByLabelText('Mark as incomplete')).toBeVisible();
    });

    it('should emit toggleImportant when star button is clicked', async () => {
        const { fixture, user } = await setup();
        const spy = jest.spyOn(fixture.componentInstance.toggleImportant, 'emit');

        const starBtn = screen.getByLabelText('Mark as important');
        await user.click(starBtn);

        expect(spy).toHaveBeenCalledWith('1');
    });

    it('should emit edit when edit button is clicked', async () => {
        const { fixture, user } = await setup();
        const spy = jest.spyOn(fixture.componentInstance.edit, 'emit');

        const editBtn = screen.getByLabelText('Edit task');
        await user.click(editBtn);

        expect(spy).toHaveBeenCalledWith(defaultTask);
    });

    it('should emit delete when delete button is clicked', async () => {
        const { fixture, user } = await setup();
        const spy = jest.spyOn(fixture.componentInstance.delete, 'emit');

        const deleteBtn = screen.getByLabelText('Delete task');
        await user.click(deleteBtn);

        expect(spy).toHaveBeenCalledWith('1');
    });
});
