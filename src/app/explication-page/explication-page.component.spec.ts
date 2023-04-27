import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplicationPageComponent } from './explication-page.component';

describe('DocumentationPageComponent', () => {
  let component: ExplicationPageComponent;
  let fixture: ComponentFixture<ExplicationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplicationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
