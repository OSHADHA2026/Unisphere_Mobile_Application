import { API_URL } from '@/constants/config';

/**
 * Backend images are stored either as absolute URLs (cloud storage) or as
 * paths relative to the API host. Returns an absolute URL, or `null` when
 * there is no image.
 */
export const resolveImageUrl = (image?: string | null): string | null => {
  if (!image) return null;
  return image.startsWith('http') ? image : `${API_URL}${image}`;
};
