import type { Metadata } from "next";
import {
  SITE_AUTHOR,
  SITE_AUTHOR_URL,
  SITE_CREATOR,
  SITE_DESCRIPTION,
  SITE_ICON,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PUBLISHER,
  SITE_TWITTER_HANDLE,
  SITE_URL,
} from "../config/constants";

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
}

/**
 * Helper function to generate metadata for Next.js App Router pages.
 *
 * @param title - The title of the page. If not provided, defaults to SITE_NAME.
 * @param description - The description of the page. If not provided, defaults to SITE_DESCRIPTION.
 * @param image - The image for Open Graph and Twitter cards. If not provided, defaults to SITE_OG_IMAGE.
 * @param icons - The favicon/icon path. If not provided, defaults to SITE_ICON.
 * @param noIndex - Whether to prevent search engines from indexing this page. Defaults to false.
 */
export function constructMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  image = SITE_OG_IMAGE,
  icons = SITE_ICON,
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SITE_TWITTER_HANDLE,
    },
    icons,
    metadataBase: new URL(SITE_URL),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    authors: [{ name: SITE_AUTHOR, url: SITE_AUTHOR_URL }],
    creator: SITE_CREATOR,
    publisher: SITE_PUBLISHER,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
  };
}
