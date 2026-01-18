import { Directive } from '@angular/core';
import { BrnAlertDialogDescription } from '@spartan-ng/brain/alert-dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
    selector: '[hlmAlertDialogDescription]',
    host: {
        'data-slot': 'alert-dialog-description',
    },
    hostDirectives: [BrnAlertDialogDescription],
})
export class HlmAlertDialogDescription {
    constructor() {
        classes(() => 'text-muted-foreground text-sm');
    }
}
