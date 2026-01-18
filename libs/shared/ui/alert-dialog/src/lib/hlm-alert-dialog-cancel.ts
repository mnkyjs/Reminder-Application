import { Directive, input } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Directive({
    selector: 'button[hlmAlertDialogCancel]',
    host: {
        '[type]': 'type()',
    },
    hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
    providers: [provideBrnButtonConfig({ variant: 'outline' })],
})
export class HlmAlertDialogCancel {
    public readonly type = input<'button' | 'reset' | 'submit'>('button');
}
