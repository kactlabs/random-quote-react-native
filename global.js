// Polyfill DOMException for React 19 + Hermes compatibility
// This must run as a Metro polyfill BEFORE any modules load
(function() {
  if (typeof globalThis.DOMException === 'undefined') {
    function DOMException(message, name) {
      var err = new Error(message);
      err.name = name || 'Error';
      err.code = 0;
      Object.setPrototypeOf(err, DOMException.prototype);
      return err;
    }
    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;
    globalThis.DOMException = DOMException;
  }
})();
