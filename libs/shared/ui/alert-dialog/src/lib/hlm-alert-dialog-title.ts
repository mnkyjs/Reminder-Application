import { Directive } from '@angular/core';
import { BrnAlertDialogTitle } from '@spartan-ng/brain/alert-dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
    selector: '[hlmAlertDialogTitle]',
    host: {
        'data-slot': 'alert-dialog-title',
    },
    hostDirectives: [BrnAlertDialogTitle],
})
export class HlmAlertDialogTitle {
    constructor() {
        classes(() => 'text-lg font-semibold');
    }
}
