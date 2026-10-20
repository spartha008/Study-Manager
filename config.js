/**
 * StudyBuddy - Supabase Configuration
 * -----------------------------------------------------------------------------
 * Fill in the two values below with your own Supabase project credentials.
 *
 * Where to find them:
 *   Supabase Dashboard -> Project Settings -> API
 *     - "Project URL"        -> SUPABASE_URL
 *     - "anon public" key    -> SUPABASE_ANON_KEY
 *
 * Also make sure you have:
 *   1. Enabled the Google provider:
 *      Dashboard -> Authentication -> Providers -> Google  (follow the docs link
 *      inside Supabase to create a Google OAuth Client ID in Google Cloud Console)
 *   2. Added your site URL to the redirect allow list:
 *      Dashboard -> Authentication -> URL Configuration
 *      e.g. http://localhost:8000 and your production URL
 *   3. Run the SQL in supabase/schema.sql once (SQL Editor) to create the
 *      per-user data table with Row Level Security.
 * -----------------------------------------------------------------------------
 */
window.STUDYBUDDY_CONFIG = {
  SUPABASE_URL: "https://vgjvccmevvvhblkvestb.supabase.co", // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "sb_publishable_sSUHe0Gxf9g60ZIFanX3Xg_WZMHEE4G"
};
