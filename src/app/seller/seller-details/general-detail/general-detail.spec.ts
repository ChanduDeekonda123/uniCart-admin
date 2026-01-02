import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDetail } from './general-detail';

describe('GeneralDetail', () => {
  let component: GeneralDetail;
  let fixture: ComponentFixture<GeneralDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
