import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceSummaryComponent } from './performance-summary.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PerformanceSummaryComponent', () => {
  let component: PerformanceSummaryComponent;
  let fixture: ComponentFixture<PerformanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceSummaryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PerformanceSummaryComponent);
    fixture.componentRef.setInput("performanceMetrics", {
      graphConstruction: 10,
      algorithm: 20,
      rendering: 5,
    });
    fixture.componentRef.setInput("graphInformations", {
      transmitters: 3,
      edges: 2,
      averageDegree: 1.33,
    });
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
