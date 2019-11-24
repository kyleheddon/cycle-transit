export const runtimeConfig =
  typeof window !== 'undefined'
    ? {
        // client
        googleMapsApiKey: window.env.googleMapsApiKey,
      }
    : {
        // server
        googleMapsApiKey: process.env.GOOGLE_MAP_API_DEV_KEY,
      };