import { TestBed } from '@angular/core/testing';
import { CoreService } from './core.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

describe('CoreService', () => {
  let service: CoreService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ],
      providers: [
        CoreService
      ],
    });
    service = TestBed.inject(CoreService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open', () => {
    const openSnackBarSpy = spyOn(snackBar, 'open'); 

    service.openSnackBar('Test message'); 

    expect(openSnackBarSpy).toHaveBeenCalled();
    expect(openSnackBarSpy).toHaveBeenCalledWith('Test message', 'OK', { duration: 2000, verticalPosition: 'top' });
  });

});
