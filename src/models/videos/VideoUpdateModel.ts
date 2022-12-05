import { Resolutions_Video } from '../../data/types/videos-types';

export type VideoUpdateModel = {
  /**
   * title, author, availableResolutions,
   * canBeDownloaded, minAgeRestriction,createdAt, publicationDate  of video
   */
  title: string;
  author: string;
  availableResolutions: Resolutions_Video[] | null;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
