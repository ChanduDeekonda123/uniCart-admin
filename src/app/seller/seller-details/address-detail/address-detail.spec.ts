import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetail } from './address-detail';

describe('AddressDetail', () => {
  let component: AddressDetail;
  let fixture: ComponentFixture<AddressDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
