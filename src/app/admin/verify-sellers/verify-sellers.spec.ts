import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySellers } from './verify-sellers';

describe('VerifySellers', () => {
  let component: VerifySellers;
  let fixture: ComponentFixture<VerifySellers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifySellers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifySellers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
