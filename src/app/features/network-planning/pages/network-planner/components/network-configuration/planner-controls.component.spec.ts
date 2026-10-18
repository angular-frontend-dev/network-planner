import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PlannerControlsComponent } from "./planner-controls.component";

describe("PlannerControlsComponent", () => {
  let component: PlannerControlsComponent;
  let fixture: ComponentFixture<PlannerControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannerControlsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
