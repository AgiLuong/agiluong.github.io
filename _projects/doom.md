---
title: DOOM (in your browser)
blurb: The original 1993 DOOM (shareware episode), compiled to WebAssembly and playable right here.
weight: 2
---
<style>
.doom-wrap { max-width: 820px; margin: 0 auto; }
#doom-canvas {
    background: #000; width: 100%; max-width: 800px; height: auto;
    aspect-ratio: 4 / 3; display: block; margin: 0 auto; image-rendering: pixelated;
}
#doom-start {
    display: block; margin: 1em auto; padding: 0.6em 1.4em; cursor: pointer;
    font-size: 1.1em; background: #0081FB; color: #fff; border: none; border-radius: 6px;
}
#doom-status { text-align: center; color: #888; font-size: 0.9em; min-height: 1.2em; }
.doom-keys { font-size: 0.9em; line-height: 1.6; }
.doom-keys code { background: #f0f0f0; padding: 1px 6px; border-radius: 4px; }
</style>

<div class="doom-wrap content">
    <p>The original <b>DOOM</b> (id Software, 1993) — shareware episode "Knee-Deep in the Dead" —
    running entirely in your browser via WebAssembly. Nothing is installed and nothing is sent
    to a server; the game engine and the freely-distributable shareware data load locally.</p>

    <button id="doom-start">Click to load &amp; play DOOM</button>
    <p id="doom-status"></p>
    <canvas id="doom-canvas" tabindex="-1" oncontextmenu="event.preventDefault()" width="800" height="600"></canvas>

    <div class="doom-keys">
        <p><b>Controls</b> (click the game first so it captures the keyboard):</p>
        <ul>
            <li><code>↑</code> <code>↓</code> or <code>W</code> <code>S</code> — move forward / back</li>
            <li><code>←</code> <code>→</code> — turn &nbsp;•&nbsp; <code>Alt</code>+arrows — strafe</li>
            <li><code>Ctrl</code> — fire &nbsp;•&nbsp; <code>Space</code> — open doors / use</li>
            <li><code>1</code>–<code>7</code> — select weapon &nbsp;•&nbsp; <code>Esc</code> — menu</li>
        </ul>
        <p style="color:#888">Best on a desktop/laptop with a keyboard. Tip: the shareware
        cheat <code>IDDQD</code> grants god mode.</p>
    </div>
</div>

{% raw %}
<script>
(function () {
    var BASE = "/assets/doom/";
    var started = false;
    var startBtn = document.getElementById("doom-start");
    var statusEl = document.getElementById("doom-status");
    function setStatus(t) { statusEl.textContent = t || ""; }

    startBtn.addEventListener("click", function () {
        if (started) return;
        started = true;
        startBtn.style.display = "none";
        setStatus("Loading DOOM… (downloading ~12 MB engine + game data)");

        var canvas = document.getElementById("doom-canvas");
        window.Module = {
            arguments: ["-iwad", "doom1.wad", "-window", "-nogui", "-nomusic",
                        "-config", "default.cfg", "-servername", "doomflare"],
            locateFile: function (path) { return BASE + path; },
            canvas: canvas,
            onRuntimeInitialized: function () {
                setStatus("Click the screen, then use the keyboard to play.");
                canvas.focus();
            },
            preRun: [function () {
                Module.FS.createPreloadedFile("", "doom1.wad", BASE + "doom1.wad", true, true);
                Module.FS.createPreloadedFile("", "default.cfg", BASE + "default.cfg", true, true);
            }],
            print: function () { console.log.apply(console, arguments); },
            printErr: function () { console.error.apply(console, arguments); },
            setStatus: function (t) { if (t) setStatus(t); },
            monitorRunDependencies: function () {}
        };
        canvas.addEventListener("click", function () { canvas.focus(); });

        var s = document.createElement("script");
        s.src = BASE + "websockets-doom.js";
        s.onerror = function () { setStatus("Failed to load the DOOM engine."); };
        document.body.appendChild(s);
    });
})();
</script>
{% endraw %}
