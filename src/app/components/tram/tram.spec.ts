import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tram } from './tram';

describe('Tram', () => {
  let component: Tram;
  let fixture: ComponentFixture<Tram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tram]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
