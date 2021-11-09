import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Subscription } from 'rxjs';
import { CameraRover } from 'src/app/core/models/cameras-rover';
import { FilterSaved } from 'src/app/core/models/filter-saved';
import { MappingCamerasRovers } from 'src/app/core/models/mapping-cameras-rovers';
import { OptionsFilters } from 'src/app/core/models/options-filters';
import {
  Photo,
  ResponseRoverPhotos,
} from 'src/app/core/models/response-rover-photos';
import { Rover } from 'src/app/core/models/rover';
import { StoragKey } from 'src/app/core/models/storage-key';
import { RoverService } from 'src/app/core/services/rover.service';
import { capitalize } from 'src/app/utils/capitalize';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
  public photos: Photo[] = [];
  public throttle: number = 500;
  public distance: number = 2;
  public page: number = 1;
  public cameras: string[] = [];
  public rovers: string[] = [];
  public filtersSaved: FilterSaved[] = [];
  public isLoadingContent: boolean = true;
  public isLoadCompletePhotos: boolean = false;
  public formFilterSeach: FormGroup;
  private subscriptions: Subscription = new Subscription();

  @ViewChild('contentScrollGallery')
  private contentScrollGalleryRef: ElementRef<HTMLElement> | undefined;
  @ViewChild(MatSelectionList)
  private filterSavedListRef: MatSelectionList | undefined;

  constructor(
    private readonly roverService: RoverService,
    private readonly activateRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly storageService: StorageMap
  ) {
    this.cameras = Object.values(CameraRover);
    this.rovers = Object.values(Rover).map(capitalize);

    this.formFilterSeach = this.formBuilder.group({
      rover: this.formBuilder.control(''),
      typeFilter: this.formBuilder.control('EARTH'),
      earthDate: this.formBuilder.control(new Date(), [Validators.required]),
      sol: this.formBuilder.control(''),
      camera: this.formBuilder.control(''),
    });

    this.subscriptionAdd = this.formFilterSeach.valueChanges.subscribe(() => {
      if (
        (this.filterSavedListRef?.selectedOptions?.selected?.length ?? 0) > 0
      ) {
        this.filterSavedListRef?.deselectAll();
      }
    });

    this.subscriptionAdd = this.formFilterSeach
      .get('rover')
      ?.valueChanges.subscribe((rover) => {
        this.cameras =
          MappingCamerasRovers[Rover[rover.toUpperCase() as Rover]];
        this.formFilterSeach.get('camera')?.setValue('');
      });

    this.subscriptionAdd = this.formFilterSeach
      .get('typeFilter')
      ?.valueChanges.subscribe((typeFilter) => {
        const earthDateControl = this.formFilterSeach.get('earthDate');
        const solControl = this.formFilterSeach.get('sol');

        if (typeFilter === 'EARTH') {
          earthDateControl?.setValidators([Validators.required]);
          earthDateControl?.updateValueAndValidity();
          solControl?.clearValidators();
          solControl?.updateValueAndValidity();
        } else {
          solControl?.setValidators([Validators.required]);
          solControl?.updateValueAndValidity();
          earthDateControl?.clearValidators();
          earthDateControl?.updateValueAndValidity();
        }
      });

    this.storageService.watch(StoragKey.FILTERS).subscribe((value) => {
      this.filtersSaved = (value as FilterSaved[]) ?? [];
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const params = this.activateRoute.snapshot.params;
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
        this.isLoadingContent = false;
        // console.log(res);
        this.photos = res.photos;
        this.formFilterSeach.get('rover')?.setValue(capitalize(rover));
      });
  }

  /**
   * @access
   */
  public set subscriptionAdd(subscribe: Subscription | undefined) {
    if (subscribe === undefined) return;

    this.subscriptions.add(subscribe);
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

  public onHandlerSubmitSearchFilter() {
    // console.log(evt);
    this.isLoadCompletePhotos = false;

    const { rover, earthDate, sol, typeFilter, camera } =
      this.formFilterSeach.value;

    const params: OptionsFilters = {
      page: 1,
    };

    if (!!camera) {
      params.camera = camera;
    }

    this.onHandlerTopScroll();

    if (typeFilter === 'EARTH') {
      this.roverService
        .getPhotosByEarthDate(rover, earthDate, params)
        .subscribe((res) => this.assignResponsePhotos(res, rover));
    } else {
      this.roverService
        .getPhotosByMartialSol(rover, sol, params)
        .subscribe((res) => this.assignResponsePhotos(res, rover));
    }
  }

  public onHandlerInfiniteScroll(): void {
    // console.log('Load more Images');
    this.isLoadCompletePhotos = false;

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

  public onHandlerSelectionFilterSaved(evt: MatSelectionListChange) {
    const values = evt.options[0].value as FilterSaved;

    this.formFilterSeach.patchValue(values.filter);
    this.onHandlerSubmitSearchFilter();
  }

  public onHandlerSaveFilter() {
    const filter = this.formFilterSeach.value;
    const filterSaved: FilterSaved = {
      createdAt: new Date(),
      filter,
      name: `Filter #${this.filtersSaved.length + 1}`,
    };
    this.storageService
      .set(StoragKey.FILTERS, [...this.filtersSaved, filterSaved])
      .subscribe(() => {});
  }

  public onHandlerTopScroll() {
    this.contentScrollGalleryRef?.nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public getErrorMessage(controlName: string) {
    const control = this.formFilterSeach.get(controlName);

    if (control?.hasError('required')) {
      return 'You must enter a value valid';
    }

    return '';
  }

  private assignResponsePhotos(res: ResponseRoverPhotos, rover: string) {
    if (res.photos.length < 25 && res.photos.length > 1) {
      this.isLoadCompletePhotos = true;
    }
    this.photos = res.photos;
    this.router.navigate(['/gallery', rover]);
  }

  private loadMoreResponsePhoto(res: ResponseRoverPhotos) {
    if (res.photos.length === 0) {
      this.isLoadCompletePhotos = true;
    }
    this.photos = [...this.photos, ...res.photos];
  }
}
