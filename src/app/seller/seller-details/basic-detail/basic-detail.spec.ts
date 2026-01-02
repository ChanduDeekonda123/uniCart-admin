import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetail } from './basic-detail';

describe('BasicDetail', () => {
  let component: BasicDetail;
  let fixture: ComponentFixture<BasicDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
