import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceSummaryComponent } from './performance-summary.component';

describe('PerformanceSummaryComponent', () => {
  let component: PerformanceSummaryComponent;
  let fixture: ComponentFixture<PerformanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceSummaryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PerformanceSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
