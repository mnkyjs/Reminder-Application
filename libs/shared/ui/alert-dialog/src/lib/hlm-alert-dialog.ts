import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BRN_ALERT_DIALOG_DEFAULT_OPTIONS, BrnAlertDialog } from '@spartan-ng/brain/alert-dialog';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

import { HlmAlertDialogOverlay } from './hlm-alert-dialog-overlay';

@Component({
    selector: 'hlm-alert-dialog',
    imports: [HlmAlertDialogOverlay],
    template: `
        <hlm-alert-dialog-overlay />
        <ng-content />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'hlmAlertDialog',
    providers: [
        {
            provide: BrnDialog,
            useExisting: forwardRef(() => HlmAlertDialog),
        },
        provideBrnDialogDefaultOptions({
            ...BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
        }),
    ],
})
export class HlmAlertDialog extends BrnAlertDialog {}
