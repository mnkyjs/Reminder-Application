import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
    },
    {
        path: 'tasks',
        loadComponent: () => import('@reminder/feature-list').then((m) => m.TaskList),
    },
];
