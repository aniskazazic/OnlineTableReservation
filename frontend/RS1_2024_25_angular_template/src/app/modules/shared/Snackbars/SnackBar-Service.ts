
import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MySnackbarHelperService {


  constructor(private snackBar: MatSnackBar) {
  }


  showMessage(message: string, duration: number = 3000): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, undefined, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }


  showMessageWithAction(
    message: string,
    action: string,
    callback: () => void,
    duration: number = 5000
  ): void {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    snackBarRef.onAction().subscribe(() => {
      callback();
    });
  }
}
