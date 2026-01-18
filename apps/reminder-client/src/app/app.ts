import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'ra-root',
    imports: [RouterModule],
    styles: `
        :host {
            display: block;
        }
    `,
    template: `
        <main class="bg-background min-h-screen">
            <router-outlet />
        </main>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
