/* ============================================================
   static-services.js — Functional Utility Library
   Host: https://api-uxidone.github.io/api/static-services.js
   Provides button effects, smooth scroll, modals, etc.
   ============================================================ */
(function () {
  'use strict';

  // ---------- DOMAIN WHITELIST ----------
  const ALLOWED_DOMAINS = [
    'uxidone.github.io',   // your own domain
    'localhost',
    '127.0.0.1',
    'krutly.github.io'
    // Add any other domains you want to allow
  ];

  const currentHost = window.location.hostname;

  // 403 - Unauthorized
  if (!ALLOWED_DOMAINS.includes(currentHost)) {
    console.error('Unable to connect server responded with the error 403 - Unauthorized');

    if (document.body) {
      const errDiv = document.createElement('div');
      errDiv.textContent = 'Unable to connect server responded with the error 403 - Unauthorized';
      errDiv.style.cssText =
        'position:fixed;top:10px;left:50%;transform:translateX(-50%);' +
        'background:#d32f2f;color:#fff;padding:10px 20px;border-radius:6px;' +
        'z-index:99999;font-family:sans-serif;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.3);';
      document.body.appendChild(errDiv);
      setTimeout(function () { errDiv.remove(); }, 6000);
    }
    return;
  }

  // ---------- THE ACTUAL FUNCTIONAL LIBRARY ----------
  const Uxidone = {

    /**
     * Add a material‑like ripple effect to any element on click.
     * @param {HTMLElement} element
     */
    rippleEffect: function (element) {
      element.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText =
          'position:absolute;border-radius:50%;background:rgba(255,255,255,.4);' +
          'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;' +
          'transform:scale(0);animation:ux-ripple 0.6s ease-out;pointer-events:none;';
        element.style.position = element.style.position || 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        ripple.addEventListener('animationend', function () { ripple.remove(); });
      });
    },

    /**
     * Smooth scroll to a target element.
     * @param {string|HTMLElement} target - selector or element
     */
    smoothScrollTo: function (target) {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /**
     * Create a simple modal dialog.
     * @param {Object} options - { title, content, onClose }
     * @returns {HTMLElement} the modal overlay element
     */
    createModal: function (options) {
      options = options || {};
      const overlay = document.createElement('div');
      overlay.className = 'ux-modal-overlay';
      overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100000;';
      const box = document.createElement('div');
      box.style.cssText =
        'background:#fff;border-radius:8px;padding:20px;max-width:90%;max-height:90%;' +
        'overflow:auto;box-shadow:0 8px 30px rgba(0,0,0,.3);font-family:sans-serif;';
      if (options.title) {
        const h3 = document.createElement('h3');
        h3.textContent = options.title;
        h3.style.margin = '0 0 10px';
        box.appendChild(h3);
      }
      const content = document.createElement('div');
      if (typeof options.content === 'string') {
        content.innerHTML = options.content;
      } else if (options.content instanceof HTMLElement) {
        content.appendChild(options.content);
      }
      box.appendChild(content);
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.cssText =
        'margin-top:15px;padding:8px 16px;background:#1976d2;color:#fff;' +
        'border:none;border-radius:4px;cursor:pointer;';
      closeBtn.addEventListener('click', function () {
        overlay.remove();
        if (typeof options.onClose === 'function') options.onClose();
      });
      box.appendChild(closeBtn);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      return overlay;
    },

    /**
     * Utility debounce function.
     */
    debounce: function (func, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
      };
    },

    /**
     * Automatically enhance elements on the page.
     * Called once when the DOM is ready.
     */
    init: function () {
      // Buttons with class "ux-btn" get ripple effect
      document.querySelectorAll('.ux-btn, button[data-ux-ripple]').forEach(function (btn) {
        Uxidone.rippleEffect(btn);
      });

      // Links with data-smooth-scroll attribute
      document.querySelectorAll('a[data-smooth-scroll]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const target = link.getAttribute('href');
          if (target && target !== '#') {
            Uxidone.smoothScrollTo(target);
          }
        });
      });

      // Back‑to‑top button if body has data-ux-back-to-top="true"
      if (document.body.getAttribute('data-ux-back-to-top') === 'true') {
        const btn = document.createElement('button');
        btn.textContent = '↑ Top';
        btn.style.cssText =
          'position:fixed;bottom:30px;right:30px;padding:8px 12px;' +
          'background:#1976d2;color:#fff;border:none;border-radius:4px;' +
          'cursor:pointer;z-index:9999;display:none;';
        btn.addEventListener('click', function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', Uxidone.debounce(function () {
          btn.style.display = window.scrollY > 300 ? 'block' : 'none';
        }, 100));
        document.body.appendChild(btn);
      }
    }
  };

  // ---------- EXPOSE GLOBALLY ----------
  window.Uxidone = Uxidone;

  // ---------- AUTO INIT WHEN DOM IS READY ----------
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    Uxidone.init();
  });

  // ---------- INJECT RIPPLE KEYFRAMES ----------
  const styleSheet = document.createElement('style');
  styleSheet.textContent =
    '@keyframes ux-ripple { to { transform: scale(4); opacity: 0; } }';
  document.head.appendChild(styleSheet);

})();
