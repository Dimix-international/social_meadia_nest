import { Resolutions_Video } from '../../data/types/videos-types';

export type VideoCreateModel = {
  /**
   * title, author, availableResolutions of video
   */
  title: string;
  author: string;
  availableResolutions: Resolutions_Video[] | null;
};
