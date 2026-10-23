import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferenceBenchmarkComponent } from './reference-benchmark.component';

describe('ReferenceBenchmarkComponent', () => {
  let component: ReferenceBenchmarkComponent;
  let fixture: ComponentFixture<ReferenceBenchmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceBenchmarkComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReferenceBenchmarkComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
