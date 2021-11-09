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
    // Variable initialization.
    this.rovers = Object.values(Rover).map(capitalize);
  }

  /**
   * @implements
   */
  ngOnInit(): void {}

  /**
   * @name getRouteForGallery
   * @param {string} roverName Name of Rover
   * @description Sets the route to return to RouterLink in HTML.
   * @author Miguel Mendoza
   * @return {string[]}
   */
  public getRouteForGallery(roverName: string) {
    return ['/gallery', roverName.toLowerCase()];
  }
}
