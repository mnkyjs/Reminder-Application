import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <main class="min-h-screen bg-background">
            <router-outlet />
        </main>
    `,
    styles: `
        :host {
            display: block;
        }
    `,
})
export class App {}
