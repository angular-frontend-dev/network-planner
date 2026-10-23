import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenchmarkConfigurationComponent } from './benchmark-configuration.component';

describe('BenchmarkConfigurationComponent', () => {
  let component: BenchmarkConfigurationComponent;
  let fixture: ComponentFixture<BenchmarkConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenchmarkConfigurationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BenchmarkConfigurationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
