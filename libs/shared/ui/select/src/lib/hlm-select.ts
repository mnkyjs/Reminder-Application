import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
    selector: 'hlm-select, brn-select[hlmSelect]',
})
export class HlmSelect {
    constructor() {
        classes(() => 'space-y-2');
    }
}
