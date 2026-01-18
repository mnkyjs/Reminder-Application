import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks',
    },
    {
        loadComponent: () => import('@reminder/feature-list').then((m) => m.TaskList),
        path: 'tasks',
    },
];
