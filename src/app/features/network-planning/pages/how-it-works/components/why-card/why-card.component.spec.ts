import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhyCardComponent } from './why-card.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('WhyCardComponent', () => {
  let component: WhyCardComponent;
  let fixture: ComponentFixture<WhyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WhyCardComponent);
    fixture.componentRef.setInput("title", "Test title");
    fixture.componentRef.setInput("description", "Test description");
    fixture.componentRef.setInput("points", ["Test point"]);
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
