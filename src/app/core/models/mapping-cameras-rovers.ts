import { CameraRover } from './cameras-rover';
import { Rover } from './rover';

export const MappingCamerasRovers = {
  [Rover.CURIOSITY]: [
    CameraRover.FHAZ,
    CameraRover.RHAZ,
    CameraRover.MAST,
    CameraRover.CHEMCAM,
    CameraRover.MAHLI,
    CameraRover.MARDI,
    CameraRover.NAVCAM,
  ],
  [Rover.OPPORTUNITY]: [
    CameraRover.FHAZ,
    CameraRover.RHAZ,
    CameraRover.NAVCAM,
    CameraRover.PANCAM,
    CameraRover.MINITES,
  ],
  [Rover.SPIRIT]: [
    CameraRover.FHAZ,
    CameraRover.RHAZ,
    CameraRover.NAVCAM,
    CameraRover.PANCAM,
    CameraRover.MINITES,
  ],
};
