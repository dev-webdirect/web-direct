/* -------------------------------
// Optional Sanity client configuration
// -------------------------------
// Not all projects require Sanity, but if you want to fetch
// content from Sanity CMS, you can use this client.
// -------------------------------

//import { createClient } from "@sanity/client";

 -------------------------------
   Configure your Sanity client here
   -------------------------------
   - projectId: your Sanity project ID
   - dataset: the dataset you want to use (usually "production")
   - apiVersion: the version of the API you want to use (use today’s date or a stable version)
   - useCdn: true = faster read-only fetches from Sanity CDN
   - token: optional, only required for write access or fetching private content
---------------------------------

export const sanityClient = createClient({
  projectId: "yourProjectId",      
  dataset: "production",           
  apiVersion: "2026-02-10",        
  useCdn: true,                     
  token: process.env.SANITY_TOKEN,
});

/* -------------------------------
   Example usage:

   // Fetch all documents of a specific type
   const posts = await sanityClient.fetch(`*[_type == "post"]{title, slug}`);

   // Fetch a single document by slug
   const post = await sanityClient.fetch(
     `*[_type == "post" && slug.current == $slug]{title, content}[0]`,
     { slug: "my-post-slug" }
   );

   Notes:
   - If your project does not require Sanity, you can leave this file empty or skip importing it.
   - Keep this file in `lib/sanity.ts` in your boilerplate for easy reuse.
---------------------------------*/
