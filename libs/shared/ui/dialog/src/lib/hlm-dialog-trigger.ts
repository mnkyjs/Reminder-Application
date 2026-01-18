import { Directive } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';

@Directive({
    selector: 'button[hlmDialogTrigger],button[hlmDialogTriggerFor]',
    host: {
        'data-slot': 'dialog-trigger',
    },
    hostDirectives: [{ directive: BrnDialogTrigger, inputs: ['id', 'brnDialogTriggerFor: hlmDialogTriggerFor', 'type'] }],
})
export class HlmDialogTrigger {}
