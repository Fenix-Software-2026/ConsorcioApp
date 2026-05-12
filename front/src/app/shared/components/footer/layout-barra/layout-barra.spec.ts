import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBarra } from './layout-barra';

describe('LayoutBarra', () => {
  let component: LayoutBarra;
  let fixture: ComponentFixture<LayoutBarra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutBarra],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutBarra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
