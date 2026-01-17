import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

import { HlmDialogOverlay } from './hlm-dialog-overlay';

@Component({
	selector: 'hlm-dialog',
	imports: [HlmDialogOverlay],
	template: `
		<hlm-dialog-overlay />
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'hlmDialog',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmDialog),
		},
		provideBrnDialogDefaultOptions({
			// add custom options here
		}),
	],
})
export class HlmDialog extends BrnDialog {}
