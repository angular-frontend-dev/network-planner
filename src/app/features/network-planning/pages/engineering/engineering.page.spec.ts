import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineeringPage } from './engineering.page';

describe('EngineeringPage', () => {
  let component: EngineeringPage;
  let fixture: ComponentFixture<EngineeringPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineeringPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EngineeringPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
