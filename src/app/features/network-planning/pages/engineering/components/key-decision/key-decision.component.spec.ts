import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyDecisionComponent } from './key-decision.component';

describe('KeyDecisionComponent', () => {
  let component: KeyDecisionComponent;
  let fixture: ComponentFixture<KeyDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyDecisionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KeyDecisionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
