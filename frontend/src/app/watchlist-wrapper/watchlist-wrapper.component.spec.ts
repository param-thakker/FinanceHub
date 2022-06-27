import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistWrapperComponent } from './watchlist-wrapper.component';

describe('WatchlistWrapperComponent', () => {
  let component: WatchlistWrapperComponent;
  let fixture: ComponentFixture<WatchlistWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchlistWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
