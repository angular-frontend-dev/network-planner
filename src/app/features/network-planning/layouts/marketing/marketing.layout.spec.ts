import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingLayout } from './marketing.layout';

describe('MarketingLayout', () => {
  let component: MarketingLayout;
  let fixture: ComponentFixture<MarketingLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingLayout]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MarketingLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
