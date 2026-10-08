export const PROFILE_IMAGE_STACK = ["React", "Next.js", "TypeScript", "Node.js"] as const;

export const PROFILE_IMAGE_FOCUS = "Frontend architecture · Design systems · Full-stack product";

export const PROFILE_IMAGE_DOMAIN = "alipajand.com";

/** Aspect ratios Google asks for when a page offers images for search results. */
export const PROFILE_IMAGE_VARIANTS = {
  "1x1": { width: 1200, height: 1200 },
  "4x3": { width: 1200, height: 900 },
  "16x9": { width: 1200, height: 675 },
} as const;

export type ProfileImageVariant = keyof typeof PROFILE_IMAGE_VARIANTS;

export const profileImagePath = (variant: ProfileImageVariant): string =>
  `/images/profile-${variant}.png`;
