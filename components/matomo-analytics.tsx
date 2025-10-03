"use client";

import { useEffect } from "react";
import { init } from "@socialgouv/matomo-next";

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

let isInitialized = false;

export function MatomoAnalytics() {
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    if (!MATOMO_URL || !MATOMO_SITE_ID) {
      if (process.env.NODE_ENV !== "production") {
        console.info("Matomo analytics disabled: NEXT_PUBLIC_MATOMO_URL or NEXT_PUBLIC_MATOMO_SITE_ID not set.");
      }
      return;
    }

    init({
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
      disableCookies: true,
    });

    isInitialized = true;
  }, []);

  return null;
}
