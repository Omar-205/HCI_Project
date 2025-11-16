import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricTrain } from './electric-train';

describe('ElectricTrain', () => {
  let component: ElectricTrain;
  let fixture: ComponentFixture<ElectricTrain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricTrain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricTrain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
