import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDialogTitle]',
	host: {
		'data-slot': 'dialog-title',
	},
	hostDirectives: [BrnDialogTitle],
})
export class HlmDialogTitle {
	constructor() {
		classes(() => 'text-lg leading-none font-semibold');
	}
}
