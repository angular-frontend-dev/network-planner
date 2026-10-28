import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkPlannerPage } from './network-planner.page';
import { beforeEach, describe, expect, it } from 'vitest';

describe('NetworkPlannerPage', () => {
  let component: NetworkPlannerPage;
  let fixture: ComponentFixture<NetworkPlannerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkPlannerPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NetworkPlannerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
