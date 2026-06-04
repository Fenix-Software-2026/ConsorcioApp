import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comunicados } from './comunicados';

describe('Comunicados', () => {
  let component: Comunicados;
  let fixture: ComponentFixture<Comunicados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comunicados],
    }).compileComponents();

    fixture = TestBed.createComponent(Comunicados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
