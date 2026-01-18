import { Directive, input } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Directive({
    selector: 'button[hlmAlertDialogAction]',
    host: {
        '[type]': 'type()',
    },
    hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
})
export class HlmAlertDialogAction {
    public readonly type = input<'button' | 'reset' | 'submit'>('button');
}
