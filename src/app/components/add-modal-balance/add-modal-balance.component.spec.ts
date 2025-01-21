import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddModalBalanceComponent } from './add-modal-balance.component';

describe('AddModalBalanceComponent', () => {
  let component: AddModalBalanceComponent;
  let fixture: ComponentFixture<AddModalBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddModalBalanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddModalBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
