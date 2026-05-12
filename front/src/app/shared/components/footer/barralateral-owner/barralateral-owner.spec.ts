import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarralateralOwner } from './barralateral-owner';

describe('BarralateralOwner', () => {
  let component: BarralateralOwner;
  let fixture: ComponentFixture<BarralateralOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarralateralOwner],
    }).compileComponents();

    fixture = TestBed.createComponent(BarralateralOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
