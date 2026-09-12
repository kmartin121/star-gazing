(function () {
  var key = "stargazing-theme";
  var root = document.documentElement;
  var savedTheme = null;

  function isDark() {
    return root.getAttribute("data-theme") === "dark";
  }

  function ensureThemeBar() {
    var existing = document.querySelector(".theme-bar");
    if (existing) return existing;

    var page = document.body.getAttribute("data-page") || "index";
    var bar = document.createElement("div");
    bar.className = "theme-bar";

    if (page === "log") {
      var home = document.createElement("a");
      home.className = "home-link";
      home.href = document.body.getAttribute("data-home") || "index.html";
      home.setAttribute("aria-label", "Back to all logs");
      home.title = "All logs";
      home.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M3 10.5L12 3l9 7.5" />' +
        '<path d="M5 9.5V21h14V9.5" />' +
        '<path d="M9 21v-7h6v7" />' +
        "</svg>";
      bar.appendChild(home);
    } else {
      var spacer = document.createElement("div");
      spacer.className = "theme-bar-spacer";
      bar.appendChild(spacer);
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.id = "theme-toggle";
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = "Dark mode";
    bar.appendChild(btn);

    document.body.insertBefore(bar, document.body.firstChild);
    return bar;
  }

  function syncButton(btn) {
    var dark = isDark();
    btn.textContent = dark ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function setTheme(theme, btn) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(key, theme);
    } catch (e) {}
    syncButton(btn);
  }

  function init() {
    ensureThemeBar();
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      setTheme(isDark() ? "light" : "dark", btn);
    });

    window.addEventListener("beforeprint", function () {
      savedTheme = isDark() ? "dark" : "light";
      root.removeAttribute("data-theme");
    });

    window.addEventListener("afterprint", function () {
      if (savedTheme === "dark") {
        root.setAttribute("data-theme", "dark");
      }
      savedTheme = null;
      syncButton(btn);
    });

    syncButton(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
