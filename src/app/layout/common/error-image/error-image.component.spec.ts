import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorImageComponent } from './error-image.component';

describe('ErrorImageComponent', () => {
  let component: ErrorImageComponent;
  let fixture: ComponentFixture<ErrorImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
