import { Directive } from '@angular/core';
import { BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';

@Directive({
	selector: 'button[hlmAlertDialogTrigger],button[hlmAlertDialogTriggerFor]',
	host: {
		'data-slot': 'alert-dialog-trigger',
	},
	hostDirectives: [
		{ directive: BrnAlertDialogTrigger, inputs: ['id', 'brnAlertDialogTriggerFor: hlmAlertDialogTriggerFor', 'type'] },
	],
})
export class HlmAlertDialogTrigger {}
