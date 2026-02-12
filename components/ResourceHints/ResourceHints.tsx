"use client";

import { useEffect } from "react";

export function ResourceHints() {
  useEffect(() => {
    const domains = ["https://www.googletagmanager.com"];

    domains.forEach((domain) => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const preconnect = document.createElement("link");
        preconnect.rel = "preconnect";
        preconnect.href = domain;
        preconnect.crossOrigin = "anonymous";
        document.head.appendChild(preconnect);

        const dnsPrefetch = document.createElement("link");
        dnsPrefetch.rel = "dns-prefetch";
        dnsPrefetch.href = domain;
        document.head.appendChild(dnsPrefetch);
      }
    });
  }, []);

  return null;
}
