// components/FeedbucketWidget.tsx
"use client";

import { useEffect } from "react";

export const FeedbucketWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.defer = true;
    script.src = "https://cdn.feedbucket.app/assets/feedbucket.js";
    script.dataset.feedbucket = process.env.NEXT_PUBLIC_FEEDBUCKET_KEY;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="feedbucket-widget"></div>; // optional placeholder
}
