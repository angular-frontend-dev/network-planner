import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarningDialogComponent } from './warning-dialog.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('WarningDialogComponent', () => {
  let component: WarningDialogComponent;
  let fixture: ComponentFixture<WarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarningDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WarningDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
