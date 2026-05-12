import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOwner } from './dashboard-owner';

describe('DashboardOwner', () => {
  let component: DashboardOwner;
  let fixture: ComponentFixture<DashboardOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOwner],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
