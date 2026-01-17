import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureEdit } from './feature-edit';

describe('FeatureEdit', () => {
    let component: FeatureEdit;
    let fixture: ComponentFixture<FeatureEdit>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeatureEdit],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureEdit);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
