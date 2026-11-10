import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomePage } from "./home.page";
import { beforeEach, describe, expect, it } from "vitest";
import { provideRouter } from "@angular/router";

describe("HomePage", () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
