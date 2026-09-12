(function () {
  var LATEST_LIMIT = 5;
  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var allSessions = [];
  var listEl = document.getElementById("session-list");
  var statusEl = document.getElementById("session-status");
  var countEl = document.getElementById("session-count");
  var yearSelect = document.getElementById("filter-year");
  var monthSelect = document.getElementById("filter-month");

  function parseDateParts(iso) {
    var parts = iso.split("-");
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2]
    };
  }

  function formatDisplayDate(iso) {
    var parts = parseDateParts(iso);
    var monthIndex = parseInt(parts.month, 10) - 1;
    return MONTH_NAMES[monthIndex] + " " + parseInt(parts.day, 10) + ", " + parts.year;
  }

  function sortSessions(sessions) {
    return sessions.slice().sort(function (a, b) {
      if (a.date === b.date) return (b.session || 0) - (a.session || 0);
      return a.date < b.date ? 1 : -1;
    });
  }

  function uniqueSorted(values) {
    return values.filter(function (value, index, arr) {
      return arr.indexOf(value) === index;
    }).sort(function (a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    });
  }

  function fillSelect(select, values, allLabel, valueFormatter) {
    var current = select.value;
    select.innerHTML = "";
    var allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = allLabel;
    select.appendChild(allOption);

    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = valueFormatter ? valueFormatter(value) : value;
      select.appendChild(option);
    });

    if (values.indexOf(current) !== -1) {
      select.value = current;
    } else {
      select.value = "";
    }
  }

  function sessionsMatching(year, month) {
    return allSessions.filter(function (session) {
      var parts = parseDateParts(session.date);
      if (year && parts.year !== year) return false;
      if (month && parts.month !== month) return false;
      return true;
    });
  }

  function filtersActive() {
    return !!(yearSelect.value || monthSelect.value);
  }

  function rebuildFilterOptions() {
    var year = yearSelect.value;
    var month = monthSelect.value;

    var years = uniqueSorted(allSessions.map(function (s) {
      return parseDateParts(s.date).year;
    }));
    fillSelect(yearSelect, years, "All years");

    var monthPool = sessionsMatching(yearSelect.value, "");
    var months = uniqueSorted(monthPool.map(function (s) {
      return parseDateParts(s.date).month;
    })).sort(function (a, b) {
      return parseInt(a, 10) - parseInt(b, 10);
    });
    fillSelect(monthSelect, months, "All months", function (value) {
      return MONTH_NAMES[parseInt(value, 10) - 1];
    });

    if (year) yearSelect.value = year;
    if (month && months.indexOf(month) !== -1) {
      monthSelect.value = month;
    } else {
      monthSelect.value = "";
    }
  }

  function renderSessions(sessions) {
    listEl.innerHTML = "";
    if (!sessions.length) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No sessions match these filters.";
      listEl.appendChild(empty);
      return;
    }

    sessions.forEach(function (session) {
      var link = document.createElement("a");
      link.className = "session";
      link.href = session.href;

      var header = document.createElement("div");
      header.className = "session-header";

      var name = document.createElement("span");
      name.className = "session-name";
      name.textContent = session.title;

      var date = document.createElement("span");
      date.className = "session-date";
      date.textContent = formatDisplayDate(session.date);

      header.appendChild(name);
      header.appendChild(date);

      var notes = document.createElement("div");
      notes.className = "session-notes";
      notes.textContent = session.summary;

      link.appendChild(header);
      link.appendChild(notes);
      listEl.appendChild(link);
    });
  }

  function updateView() {
    rebuildFilterOptions();

    var filtered = sessionsMatching(yearSelect.value, monthSelect.value);
    var active = filtersActive();
    var visible = active ? filtered : filtered.slice(0, LATEST_LIMIT);

    if (countEl) {
      var total = allSessions.length;
      countEl.textContent = total === 1 ? "1 night logged" : total + " nights logged";
    }

    if (statusEl) {
      if (active) {
        statusEl.textContent =
          "Showing " + visible.length + " matching session" + (visible.length === 1 ? "" : "s") + ".";
      } else if (allSessions.length > LATEST_LIMIT) {
        statusEl.textContent =
          "Showing the " + LATEST_LIMIT + " latest sessions. Use filters to browse earlier nights.";
      } else {
        statusEl.textContent = "Newest session first. Open a night to read the full observation log.";
      }
    }

    renderSessions(visible);
  }

  yearSelect.addEventListener("change", function () {
    monthSelect.value = "";
    updateView();
  });
  monthSelect.addEventListener("change", updateView);

  var data = window.STARGAZING_SESSIONS;
  if (!Array.isArray(data)) {
    if (statusEl) {
      statusEl.textContent = "Could not load the session catalog.";
    }
    if (listEl) {
      listEl.innerHTML = '<div class="empty-state">Unable to load sessions.js.</div>';
    }
    return;
  }

  allSessions = sortSessions(data);
  updateView();
})();
