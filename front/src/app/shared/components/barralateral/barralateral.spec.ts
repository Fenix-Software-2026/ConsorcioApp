import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Barralateral } from './barralateral';

describe('Barralateral', () => {
  let component: Barralateral;
  let fixture: ComponentFixture<Barralateral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Barralateral],
    }).compileComponents();

    fixture = TestBed.createComponent(Barralateral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
