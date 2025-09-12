function preloadImage(url) {
  const img = new Image();
  img.src = url;
}

// Call this function early in your script, e.g., in the <head> or at the top of a script block
preloadImage('assets 2/logo.png');