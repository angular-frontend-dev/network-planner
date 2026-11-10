import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuntimeComponent } from './runtime.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('RuntimeComponent', () => {
  let component: RuntimeComponent;
  let fixture: ComponentFixture<RuntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuntimeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RuntimeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
