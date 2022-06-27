import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPortfolioWrapperComponent } from './my-portfolio-wrapper.component';

describe('MyPortfolioWrapperComponent', () => {
  let component: MyPortfolioWrapperComponent;
  let fixture: ComponentFixture<MyPortfolioWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPortfolioWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPortfolioWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
