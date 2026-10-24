import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldErrorsComponent } from './field-errors.component';

describe('FieldErrorsComponent', () => {
  let component: FieldErrorsComponent;
  let fixture: ComponentFixture<FieldErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldErrorsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FieldErrorsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
