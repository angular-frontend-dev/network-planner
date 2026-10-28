import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkPlannerLayout } from './network-planner.layout';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideRouter } from '@angular/router';

describe('NetworkPlannerLayout', () => {
  let component: NetworkPlannerLayout;
  let fixture: ComponentFixture<NetworkPlannerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkPlannerLayout],
      providers: [provideRouter([])],
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
