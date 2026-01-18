import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv({
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
});

global.ResizeObserver = class {
    disconnect() {
        return;
    }
    observe() {
        return;
    }
    unobserve() {
        return;
    }
};
