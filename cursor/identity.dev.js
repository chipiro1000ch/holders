// Cursor app identity: simulated viewer for local development (JS twin for bundlers that resolve the .js import in identity.ts).
// Keep in sync with identity.dev.ts.

/** @type {import('./identity.ts').DevViewer | null} */
export const DEV_VIEWER = {
  sub: "user:dev",
  email: "dev@example.com",
  name: "Dev Viewer",
  teamId: 1,
  teamRole: "admin",
};
