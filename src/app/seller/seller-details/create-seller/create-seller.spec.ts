import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeller } from './create-seller';

describe('CreateSeller', () => {
  let component: CreateSeller;
  let fixture: ComponentFixture<CreateSeller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSeller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSeller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
