// This file will be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // Use environment variable or fallback to relative path
  apiUrl: process.env['BACKEND_API_URL'] || 'https://interview-prep-hub-backend.onrender.com/api'
};
