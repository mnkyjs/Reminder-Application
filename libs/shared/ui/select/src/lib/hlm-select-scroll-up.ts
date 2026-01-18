import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
    selector: 'hlm-select-scroll-up',
    imports: [NgIcon, HlmIcon],
    template: `
        <ng-icon
            hlm
            size="sm"
            class="ml-2"
            name="lucideChevronUp" />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideIcons({ lucideChevronUp })],
})
export class HlmSelectScrollUp {
    constructor() {
        classes(() => 'flex cursor-default items-center justify-center py-1');
    }
}
