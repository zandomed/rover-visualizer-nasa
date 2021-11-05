import { Component, OnInit } from '@angular/core';
import { Rover } from 'src/app/core/models/rover';
import { capitalize } from 'src/app/utils/capitalize';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public rovers: string[] = [];

  constructor() {
    this.rovers = Object.values(Rover).map(capitalize);
  }

  ngOnInit(): void {}
}
