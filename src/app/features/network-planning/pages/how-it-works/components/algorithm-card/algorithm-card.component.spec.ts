import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlgorithmCardComponent } from './algorithm-card.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AlgorithmCardComponent', () => {
  let component: AlgorithmCardComponent;
  let fixture: ComponentFixture<AlgorithmCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgorithmCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AlgorithmCardComponent);
    fixture.componentRef.setInput("stepNumber", 1);
    fixture.componentRef.setInput("title", "Test title");
    fixture.componentRef.setInput("description", "Test description");
    fixture.componentRef.setInput("imgUrl", "test-image.png");
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
