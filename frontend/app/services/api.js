// services/api.js kept as a thin compatibility/route stub so expo-router
// won't try to treat the implementation file as a page without a default export.
// The actual implementation lives at app/_services/api.js
export * from '../_services/api';
export { apiService, API_HOSTNAME } from '../_services/api';

import React from 'react';

// Default export is a harmless component so the router stops warning about
// "missing the required default export" when scanning files under `app/`.
export default function ServicesApiRoute() {
  return null;
}