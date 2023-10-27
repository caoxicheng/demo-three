import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyThreejsComponent } from './my-threejs.component';

describe('MyThreejsComponent', () => {
  let component: MyThreejsComponent;
  let fixture: ComponentFixture<MyThreejsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyThreejsComponent]
    });
    fixture = TestBed.createComponent(MyThreejsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
