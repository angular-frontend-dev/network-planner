import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepCardComponent } from './step-card.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('StepCardComponent', () => {
  let component: StepCardComponent;
  let fixture: ComponentFixture<StepCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StepCardComponent);
    fixture.componentRef.setInput("stepNumber", 1);
    fixture.componentRef.setInput("title", "Test title");
    fixture.componentRef.setInput("imgUrl", "test-image.png");
    fixture.componentRef.setInput("description", "Test description");
    fixture.componentRef.setInput("content", "Test content");
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
