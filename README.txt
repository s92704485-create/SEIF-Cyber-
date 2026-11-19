SAIF CYBER Academy update

Upload the contents of this ZIP to the root of your existing GitHub Pages repository, replacing index.html and keeping the manifest, service worker, and icons at the shown paths.

The member dashboard reads published courses, lessons, and lesson pages from the existing Supabase project using the signed-in user session and existing Row Level Security policies. Draft lesson 1 remains hidden while is_published=false.

The quiz is currently checked in the browser only. Persistent student progress and pass-gating still require a confirmed student_progress schema and database policy integration.

The HTML and inline JavaScript syntax were checked locally. A live authenticated Supabase test and GitHub Pages deployment have not been performed.
