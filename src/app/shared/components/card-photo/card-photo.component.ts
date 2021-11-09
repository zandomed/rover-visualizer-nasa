import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Photo } from 'src/app/core/models/response-rover-photos';

@Component({
  selector: 'app-card-photo',
  templateUrl: './card-photo.component.html',
  styleUrls: ['./card-photo.component.scss'],
})
export class CardPhotoComponent implements OnInit {
  @Input('photo') public photo: Photo | undefined;

  constructor(
    private readonly clipboard: Clipboard,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * @name onHandlerSharePhoto
   * @description Allows you to copy the url of the image to share it.
   * @author Miguel Mendoza
   */
  public onHandlerSharePhoto() {
    try {
      this.clipboard.copy(this.photo?.img_src ?? '');
      this.snackBar.open(
        'Your new mission has been copied to the clipboard!',
        "Let's go!"
      );
    } catch (err) {
      this.snackBar.open('Abort mission! a problem occurred', 'Close');
    }
  }
}
