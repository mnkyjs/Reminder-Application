import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
    selector: '[hlmDialogDescription]',
    host: {
        'data-slot': 'dialog-description',
    },
    hostDirectives: [BrnDialogDescription],
})
export class HlmDialogDescription {
    constructor() {
        classes(() => 'text-muted-foreground text-sm');
    }
}
