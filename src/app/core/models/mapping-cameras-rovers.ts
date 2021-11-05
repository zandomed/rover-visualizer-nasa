import { CameraRover } from './cameras-rover';
import { Rover } from './rover';

export const MappingCamerasRovers = {
  [Rover.CURIOSITY]: [
    CameraRover.ALL,
    CameraRover.FHAZ,
    CameraRover.RHAZ,
    CameraRover.MAST,
    CameraRover.CHEMCAM,
    CameraRover.MAHLI,
    CameraRover.MARDI,
    CameraRover.NAVCAM,
  ],
  [Rover.OPPORTUNITY]: [
    CameraRover.ALL,
    CameraRover.FHAZ,
    CameraRover.RHAZ,
    CameraRover.NAVCAM,
    CameraRover.PANCAM,
    CameraRover.MINITES,
  ],
  [Rover.SPIRIT]: [
    CameraRover.ALL,
    CameraRover.FHAZ,
    CameraRover.RHAZ,
    CameraRover.NAVCAM,
    CameraRover.PANCAM,
    CameraRover.MINITES,
  ],
};
