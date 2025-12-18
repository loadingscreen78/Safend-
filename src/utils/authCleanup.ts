export const cleanupAuthState = () => {
  try {
    // Remove Firebase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('firebase:') || key.includes('firebaseLocalStorageDb')) {
        localStorage.removeItem(key);
      }
    });

    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('firebase:') || key.includes('firebaseLocalStorageDb')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    // no-op
  }
};
