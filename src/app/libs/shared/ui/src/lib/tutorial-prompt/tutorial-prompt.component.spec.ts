import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorialPromptComponent } from './tutorial-prompt.component';

describe('TutorialPromptComponent', () => {
  let component: TutorialPromptComponent;
  let fixture: ComponentFixture<TutorialPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialPromptComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TutorialPromptComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
