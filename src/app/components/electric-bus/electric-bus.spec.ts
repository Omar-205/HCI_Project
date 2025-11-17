import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricBus } from './electric-bus';

describe('ElectricBus', () => {
  let component: ElectricBus;
  let fixture: ComponentFixture<ElectricBus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricBus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricBus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
