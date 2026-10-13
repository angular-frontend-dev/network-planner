import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkPlannerLayout } from './network-planner.layout';

describe('NetworkPlannerLayout', () => {
  let component: NetworkPlannerLayout;
  let fixture: ComponentFixture<NetworkPlannerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkPlannerLayout]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NetworkPlannerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
