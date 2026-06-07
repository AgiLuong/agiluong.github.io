(function () {
  "use strict";

  // Each game maps to a JSON data file under data/. Add a game by adding an
  // entry here and dropping a matching JSON file in data/.
  var GAMES = [
    { id: "belowzero", label: "Below Zero", file: "data/belowzero.json" },
    { id: "subnautica", label: "Subnautica", file: "data/subnautica.json" },
    { id: "subnautica2", label: "Subnautica 2", file: "data/subnautica2.json" }
  ];

  var BASE = "/assets/subnautica-almanac/";
  var cache = {};       // gameId -> dataset
  var current = null;   // current dataset
  var selectedName = null;

  var els = {};

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function loadGame(gameId) {
    var game = GAMES.filter(function (g) { return g.id === gameId; })[0];
    setActiveButton(gameId);
    els.list.innerHTML = "";
    els.detail.innerHTML = "";
    selectedName = null;

    if (cache[gameId]) { onLoaded(cache[gameId]); return; }

    els.detail.appendChild(el("p", "alm-empty", "Loading " + game.label + "..."));
    fetch(BASE + game.file, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("no data"); return r.json(); })
      .then(function (data) {
        cache[gameId] = data;
        onLoaded(data);
      })
      .catch(function () {
        current = null;
        els.list.innerHTML = "";
        els.detail.innerHTML = "";
        var note = el("div", "alm-note");
        note.innerHTML = "<b>" + game.label + "</b> crafting data isn't available yet. " +
          "Subnautica 2 is still early in development, so its recipes are added as they're confirmed.";
        els.detail.appendChild(note);
      });
  }

  function onLoaded(data) {
    current = data;
    renderList(els.search.value);
    els.detail.innerHTML = "";
    var n = Object.keys(items()).length;
    var p = el("p", "alm-empty",
      "Select an item from the list to see its locations, crafting tree, and total raw-material cost. (" +
      n + " items)");
    els.detail.appendChild(p);
  }

  function items() {
    return current && current.items ? current.items : {};
  }

  function renderList(filter) {
    els.list.innerHTML = "";
    var its = items();
    var names = Object.keys(its).sort();
    filter = (filter || "").trim().toLowerCase();
    var shown = 0;
    names.forEach(function (name) {
      if (filter && name.toLowerCase().indexOf(filter) === -1) return;
      shown++;
      var row = el("div", "alm-list-item", name);
      if (name === selectedName) row.classList.add("active");
      if (its[name].raw) {
        var t = el("span", "tag-raw", "raw");
        row.appendChild(t);
      }
      row.addEventListener("click", function () { selectItem(name); });
      els.list.appendChild(row);
    });
    if (shown === 0) {
      els.list.appendChild(el("div", "alm-empty", "No items match."));
    }
  }

  function selectItem(name) {
    selectedName = name;
    Array.prototype.forEach.call(els.list.children, function (c) {
      c.classList.toggle("active", c.firstChild && c.textContent.replace("raw", "").trim() === name);
    });
    renderDetail(name);
    if (window.innerWidth <= 720) {
      els.detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function chips(values) {
    var wrap = el("div", "alm-chips");
    values.forEach(function (v) { wrap.appendChild(el("span", "alm-chip", v)); });
    return wrap;
  }

  // Recursive, collapsible recipe tree.
  function buildTree(name, qty) {
    var its = items();
    var li = el("li");
    var node = el("div", "alm-node");
    var item = its[name];
    var hasChildren = item && !item.raw && item.recipe && Object.keys(item.recipe).length > 0;

    var label = el("span");
    if (qty != null) {
      var q = el("span", "alm-qty", qty + "x ");
      label.appendChild(q);
    }
    label.appendChild(document.createTextNode(name));
    if (item && (item.raw || !hasChildren) && item) {
      if (item.raw) label.classList.add("alm-raw-leaf");
    }

    if (hasChildren) {
      node.classList.add("expandable");
      var twisty = el("span", "twisty", "+");
      node.appendChild(twisty);
      node.appendChild(label);
      var childUl = el("ul");
      childUl.style.display = "none";
      Object.keys(item.recipe).sort().forEach(function (ing) {
        childUl.appendChild(buildTree(ing, item.recipe[ing]));
      });
      node.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = childUl.style.display !== "none";
        childUl.style.display = open ? "none" : "block";
        twisty.textContent = open ? "+" : "\u2212";
      });
      li.appendChild(node);
      li.appendChild(childUl);
    } else {
      node.appendChild(el("span", "twisty", ""));
      node.appendChild(label);
      li.appendChild(node);
    }
    return li;
  }

  function section(title) {
    var s = el("div", "alm-section");
    s.appendChild(el("h4", null, title));
    return s;
  }

  function renderDetail(name) {
    var its = items();
    var item = its[name];
    els.detail.innerHTML = "";
    if (!item) { els.detail.appendChild(el("p", "alm-empty", "Unknown item.")); return; }

    els.detail.appendChild(el("h2", null, item.name));
    if (item.category) els.detail.appendChild(el("p", "alm-cat", item.category));
    if (item.description) els.detail.appendChild(el("p", "alm-desc", item.description));

    // Locations
    var loc = section(item.raw ? "Where to find it" : "Where to get it");
    var any = false;
    if (item.biomes && item.biomes.length) {
      var b = el("div"); b.appendChild(el("div", null, "Biomes:"));
      b.appendChild(chips(item.biomes)); loc.appendChild(b); any = true;
    }
    if (item.acquired_from && item.acquired_from.length) {
      var a = el("div"); a.style.marginTop = "8px";
      a.appendChild(el("div", null, "Acquired from:"));
      a.appendChild(chips(item.acquired_from)); loc.appendChild(a); any = true;
    }
    if (!any) loc.appendChild(el("p", "alm-empty", "No location data."));
    els.detail.appendChild(loc);

    // Recipe tree (only for craftable)
    if (!item.raw && item.recipe && Object.keys(item.recipe).length) {
      var rs = section("Crafting tree");
      rs.appendChild(el("p", "alm-cat", "Click a component to expand its recipe."));
      var ul = el("ul", "alm-tree");
      Object.keys(item.recipe).sort().forEach(function (ing) {
        ul.appendChild(buildTree(ing, item.recipe[ing]));
      });
      rs.appendChild(ul);
      els.detail.appendChild(rs);

      // Raw totals
      var ts = section("Total raw materials");
      var totals = item.raw_totals || {};
      var keys = Object.keys(totals).sort();
      if (keys.length) {
        var grid = el("div", "alm-totals");
        keys.forEach(function (k) {
          var t = el("div", "alm-total");
          t.innerHTML = "<b>" + totals[k] + "x</b> " + k;
          grid.appendChild(t);
        });
        ts.appendChild(grid);
      } else {
        ts.appendChild(el("p", "alm-empty", "No raw-material breakdown."));
      }
      els.detail.appendChild(ts);
    } else if (item.raw) {
      var note = el("p", "alm-cat", "This is a raw material \u2014 gather it directly (no crafting recipe).");
      els.detail.appendChild(note);
    }
  }

  function setActiveButton(gameId) {
    Array.prototype.forEach.call(els.games.children, function (b) {
      b.classList.toggle("active", b.getAttribute("data-game") === gameId);
    });
  }

  function init() {
    var root = document.getElementById("almanac");
    if (!root) return;

    els.games = el("div", "alm-games");
    GAMES.forEach(function (g) {
      var b = el("button", "alm-game-btn", g.label);
      b.setAttribute("data-game", g.id);
      b.addEventListener("click", function () { loadGame(g.id); });
      els.games.appendChild(b);
    });

    els.search = el("input", "alm-search");
    els.search.type = "search";
    els.search.placeholder = "Search items (e.g. Plasteel, Seaglide, Lithium)...";
    els.search.addEventListener("input", function () { renderList(els.search.value); });

    var layout = el("div", "alm-layout");
    els.list = el("div", "alm-list");
    els.detail = el("div", "alm-detail");
    layout.appendChild(els.list);
    layout.appendChild(els.detail);

    root.appendChild(els.games);
    root.appendChild(els.search);
    root.appendChild(layout);

    loadGame(GAMES[0].id);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
