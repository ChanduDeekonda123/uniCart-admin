import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryDetail } from './statutory-detail';

describe('StatutoryDetail', () => {
  let component: StatutoryDetail;
  let fixture: ComponentFixture<StatutoryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatutoryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatutoryDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
