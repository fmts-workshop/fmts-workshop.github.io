/* FMTS @ NeurIPS 2026: small, dependency-free progressive enhancements. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  function markCurrentNavItem() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;

    var links = document.querySelectorAll(".nav-links a[data-nav]");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-nav") === page) {
        links[i].setAttribute("aria-current", "page");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
  }

  function wireMobileNavigation() {
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!nav || !toggle || !links) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      toggle.setAttribute("title", open ? "Close navigation" : "Open navigation");
      toggle.textContent = open ? "\u00d7" : "\u2630";
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) setOpen(false);
    });

    setOpen(false);
  }

  function initials(name) {
    var words = String(name || "")
      .replace(/[^A-Za-z\u00c0-\u024f\s.-]/g, " ")
      .split(/\s+/)
      .filter(function (word) {
        return word && word.replace(/\./g, "").length > 0;
      });
    if (!words.length) return "?";

    var fullWords = words.filter(function (word) {
      return word.replace(/\./g, "").length > 1;
    });
    var use = fullWords.length >= 2
      ? [fullWords[0], fullWords[fullWords.length - 1]]
      : words.slice(0, 2);

    return use.map(function (word) {
      return word.charAt(0).toUpperCase();
    }).join("");
  }

  function replaceWithMonogram(img) {
    var name = img.getAttribute("data-name") || img.getAttribute("alt") || "";
    var span = document.createElement("span");
    span.className = img.closest(".speaker-tile") ? "portrait-placeholder" : "monogram";
    span.setAttribute("aria-hidden", "true");
    span.textContent = initials(name);
    if (img.parentNode) img.parentNode.replaceChild(span, img);
  }

  function wirePortraitFallback() {
    var images = document.querySelectorAll("img.portrait");
    for (var i = 0; i < images.length; i++) {
      (function (img) {
        if (img.complete && img.naturalWidth === 0) {
          replaceWithMonogram(img);
          return;
        }
        img.addEventListener("error", function () {
          replaceWithMonogram(img);
        }, { once: true });
      })(images[i]);
    }
  }

  function init() {
    markCurrentNavItem();
    wireMobileNavigation();
    wirePortraitFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
