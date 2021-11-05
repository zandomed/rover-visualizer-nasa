import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/core/models/response-rover-photos';
import { Rover } from 'src/app/core/models/rover';
import { RoverService } from 'src/app/core/services/rover.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  public photos: Photo[] = [];

  constructor(
    private readonly roverService: RoverService,
    private readonly activateRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      const roverParam = new String(params['rover']);
      const rover = Rover[roverParam.toUpperCase() as Rover];

      if (!rover) {
        this.router.navigate(['/not-found']);
      }

      this.roverService
        .getPhotosByEarthDate(rover, new Date(2021, 10, 3), {
          page: 1,
        })
        .subscribe((res) => {
          console.log(res);
          this.photos = res.photos;
        });

      // console.log(rover); // price
    });
  }
}
