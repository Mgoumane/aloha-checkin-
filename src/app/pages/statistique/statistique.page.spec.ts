import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatistiquePage } from './statistique.page';

describe('StatistiquePage', () => {
  let component: StatistiquePage;
  let fixture: ComponentFixture<StatistiquePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StatistiquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
