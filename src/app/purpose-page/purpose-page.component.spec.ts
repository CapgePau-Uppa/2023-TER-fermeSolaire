import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurposePageComponent } from './purpose-page.component';

describe('PurposePageComponent', () => {
  let component: PurposePageComponent;
  let fixture: ComponentFixture<PurposePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurposePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurposePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
