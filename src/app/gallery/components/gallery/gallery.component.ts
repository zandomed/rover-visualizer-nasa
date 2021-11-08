import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CameraRover } from 'src/app/core/models/cameras-rover';
import { MappingCamerasRovers } from 'src/app/core/models/mapping-cameras-rovers';
import { OptionsFilters } from 'src/app/core/models/options-filters';
import {
  Photo,
  ResponseRoverPhotos,
} from 'src/app/core/models/response-rover-photos';
import { Rover } from 'src/app/core/models/rover';
import { RoverService } from 'src/app/core/services/rover.service';
import { capitalize } from 'src/app/utils/capitalize';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  public photos: Photo[] = [];
  public throttle: number = 500;
  public distance: number = 2;
  public page: number = 1;
  public cameras: string[] = [];
  public rovers: string[] = [];

  public formFilterSeach: FormGroup;

  // private roverInParams: Rover = Rover.CURIOSITY;
  constructor(
    private readonly roverService: RoverService,
    private readonly activateRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) {
    this.cameras = Object.values(CameraRover);
    this.rovers = Object.values(Rover).map(capitalize);

    this.formFilterSeach = this.formBuilder.group({
      rover: this.formBuilder.control(''),
      typeFilter: this.formBuilder.control('EARTH'),
      earthDate: this.formBuilder.control(new Date()),
      sol: this.formBuilder.control(''),
      camera: this.formBuilder.control(''),
    });

    this.formFilterSeach.get('rover')?.valueChanges.subscribe((rover) => {
      this.cameras = MappingCamerasRovers[Rover[rover.toUpperCase() as Rover]];
      this.formFilterSeach.get('camera')?.setValue('');
    });
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      const roverParam = new String(params['rover']);
      const rover = Rover[roverParam.toUpperCase() as Rover];

      if (!rover) {
        this.router.navigate(['/not-found']);
      }

      const earthDate = this.formFilterSeach.get('earthDate')?.value;

      this.cameras = MappingCamerasRovers[rover];

      this.roverService
        .getPhotosByEarthDate(rover, earthDate, {
          page: 1,
        })
        .subscribe((res) => {
          console.log(res);
          this.photos = res.photos;
          this.formFilterSeach.get('rover')?.setValue(capitalize(rover));
        });
    });
  }

  public onHandlerResetForm() {
    const { rover } = this.formFilterSeach.value;
    this.cameras = MappingCamerasRovers[Rover[rover.toUpperCase() as Rover]];
    this.formFilterSeach.reset({
      rover,
      typeFilter: 'EARTH',
      earthDate: new Date(),
      sol: '',
      camera: '',
    });
  }

  public onHandlerSubmitSearchFilter(evt: SubmitEvent) {
    // console.log(evt);
    const { rover, earthDate, sol, typeFilter, camera } =
      this.formFilterSeach.value;

    const params: OptionsFilters = {
      page: 1,
    };

    if (!!camera) {
      params.camera = camera;
    }

    if (typeFilter === 'EARTH') {
      this.roverService
        .getPhotosByEarthDate(rover, earthDate, params)
        .subscribe(this.assignResponsePhotos.bind(this));
    } else {
      this.roverService
        .getPhotosByMartialSol(rover, sol, params)
        .subscribe(this.assignResponsePhotos.bind(this));
    }
  }

  public onHandlerInfiniteScroll(): void {
    console.log('Load more Images');

    const { rover, sol, earthDate, typeFilter, camera } =
      this.formFilterSeach.value;

    const params: OptionsFilters = {
      page: ++this.page,
    };

    if (!!camera) {
      params.camera = camera;
    }

    if (typeFilter === 'EARTH') {
      this.roverService
        .getPhotosByEarthDate(rover, earthDate, params)
        .subscribe(this.loadMoreResponsePhoto.bind(this));
    } else {
      this.roverService
        .getPhotosByMartialSol(rover, sol, params)
        .subscribe(this.loadMoreResponsePhoto.bind(this));
    }
  }
  private assignResponsePhotos(res: ResponseRoverPhotos) {
    this.photos = res.photos;
  }

  private loadMoreResponsePhoto(res: ResponseRoverPhotos) {
    this.photos = [...this.photos, ...res.photos];
  }
}
