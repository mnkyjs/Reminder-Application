import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NxWelcome } from './nx-welcome';

@Component({
    selector: 'app-root',
    imports: [NxWelcome, RouterModule],
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App {
    protected title = 'reminder-client';
}
