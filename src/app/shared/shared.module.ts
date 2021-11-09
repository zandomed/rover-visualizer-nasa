import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { CardPhotoComponent } from './components/card-photo/card-photo.component';

@NgModule({
  declarations: [CardPhotoComponent],
  imports: [CommonModule, MaterialModule],
  exports: [CardPhotoComponent, MaterialModule],
})
export class SharedModule {}
