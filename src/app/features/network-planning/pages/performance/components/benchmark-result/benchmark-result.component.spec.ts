import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenchmarkResultComponent } from './benchmark-result.component';

describe('BenchmarkResultComponent', () => {
  let component: BenchmarkResultComponent;
  let fixture: ComponentFixture<BenchmarkResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenchmarkResultComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BenchmarkResultComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
