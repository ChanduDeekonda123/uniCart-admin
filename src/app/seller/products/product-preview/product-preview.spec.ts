import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreview } from './product-preview';

describe('ProductPreview', () => {
  let component: ProductPreview;
  let fixture: ComponentFixture<ProductPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
