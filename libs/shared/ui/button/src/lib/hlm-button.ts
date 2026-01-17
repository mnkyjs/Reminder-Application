import type { ClassValue } from 'clsx';

import { Directive, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
	"focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base",
	{
		defaultVariants: {
			size: 'default',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h-9 px-4 py-2 has-[>ng-icon]:px-3',
				icon: 'size-9',
				'icon-lg': 'size-10',
				'icon-sm': 'size-8',
				'icon-xs': `size-6 [&_ng-icon:not([class*='text-'])]:text-xs`,
				lg: 'h-10 rounded-md px-6 has-[>ng-icon]:px-4',
				sm: 'h-8 gap-1.5 rounded-md px-3 has-[>ng-icon]:px-2.5',
			},
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				outline:
					'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			},
		},
	},
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
	selector: 'button[hlmBtn], a[hlmBtn]',
	exportAs: 'hlmBtn',
	host: {
		'data-slot': 'button',
	},
	hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
})
export class HlmButton {
	private readonly _config = injectBrnButtonConfig();

	public readonly size = input<ButtonVariants['size']>(this._config.size);

	public readonly variant = input<ButtonVariants['variant']>(this._config.variant);

	private readonly _additionalClasses = signal<ClassValue>('');

	constructor() {
		classes(() => [buttonVariants({ size: this.size(), variant: this.variant() }), this._additionalClasses()]);
	}

	setClass(classes: string): void {
		this._additionalClasses.set(classes);
	}
}
