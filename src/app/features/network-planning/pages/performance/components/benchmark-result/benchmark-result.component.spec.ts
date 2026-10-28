import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenchmarkResultComponent } from './benchmark-result.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('BenchmarkResultComponent', () => {
  let component: BenchmarkResultComponent;
  let fixture: ComponentFixture<BenchmarkResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenchmarkResultComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BenchmarkResultComponent);
    fixture.componentRef.setInput("performanceMetrics", {
      graphConstruction: 10,
      algorithm: 20,
      totalRuntime: 30,
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
