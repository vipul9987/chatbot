(function () {
  // Prevent multiple injections
  if (window.__WIDGET_LOADED) return;
  window.__WIDGET_LOADED = true;

  const CONFIG = {
    // Current origin where the widget is hosted
    src: window.location.origin, 
    width: '450px',
    height: '850px',
    zIndex: '2147483647' // Max z-index
  };

  const iframe = document.createElement("iframe");
  iframe.src = CONFIG.src;
  
  // Apply styles with !important to defeat global styles on custom-coded sites
  const styles = {
    position: "fixed",
    bottom: "0",
    right: "0",
    width: CONFIG.width,
    height: CONFIG.height,
    border: "none",
    background: "transparent",
    colorScheme: "light",
    zIndex: CONFIG.zIndex,
    visibility: "visible"
  };

  Object.keys(styles).forEach(key => {
    iframe.style.setProperty(key, styles[key], "important");
  });

  // Critical attributes for transparency
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("scrolling", "no");
  
  // Ensure the iframe body doesn't block the site before the content loads
  iframe.style.pointerEvents = "none";
  
  // Re-enable pointer events once we know our internal logic is ready
  // Note: Our internal index.html logic sets pointer-events: none on the root, 
  // so the iframe itself can stay 'auto' without blocking the site.
  iframe.style.pointerEvents = "auto";

  document.body.appendChild(iframe);
  
  console.log("Premium Chat Widget Loaded Successfully");
})();