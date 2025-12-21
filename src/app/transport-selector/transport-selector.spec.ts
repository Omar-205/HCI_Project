import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSelector } from './transport-selector';

describe('TransportSelector', () => {
  let component: TransportSelector;
  let fixture: ComponentFixture<TransportSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
