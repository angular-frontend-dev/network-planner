import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomGraphComponent } from './random-graph.component';

describe('RandomGraphComponent', () => {
  let component: RandomGraphComponent;
  let fixture: ComponentFixture<RandomGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomGraphComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RandomGraphComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
