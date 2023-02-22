import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsPurposeComponent } from './buttons-purpose.component';

describe('ButtonsPurposeComponent', () => {
  let component: ButtonsPurposeComponent;
  let fixture: ComponentFixture<ButtonsPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsPurposeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonsPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
