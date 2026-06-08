---
title: DOOM (in your browser)
blurb: The original 1993 DOOM (shareware episode), running in your browser — playable with a keyboard, no install.
weight: 2
---
<link rel="stylesheet" href="/assets/doom/js-dos.css">

<style>
.doom-intro { max-width: 800px; margin: 0 auto; }
.doom-stage {
    width: 100%;
    max-width: 960px;
    margin: 1.2em auto;
    aspect-ratio: 4 / 3;
    background: #000;
}
#dos { width: 100%; height: 100%; }
.doom-keys { max-width: 800px; margin: 0 auto; font-size: 0.9em; line-height: 1.6; }
.doom-keys code { background: #f0f0f0; padding: 1px 6px; border-radius: 4px; }
@media (max-width: 720px) { .doom-stage { aspect-ratio: 4 / 3; } }
</style>

<div class="doom-intro content">
    <p>The original <b>DOOM</b> (id Software, 1993) — shareware episode "Knee-Deep in the Dead" —
    running entirely in your browser. The game runs through an MS-DOS emulator compiled to
    WebAssembly; nothing is installed and nothing is sent to a server — the engine and the
    freely-distributable shareware data load locally.</p>
</div>

<div class="doom-stage">
    <div id="dos"></div>
</div>

<div class="doom-keys content">
    <p><b>Controls</b> — click <i>Start</i>, then click the game so it captures the keyboard:</p>
    <ul>
        <li><code>↑</code> <code>↓</code> — move forward / back &nbsp;•&nbsp; <code>←</code> <code>→</code> — turn</li>
        <li><code>Alt</code>+arrows — strafe &nbsp;•&nbsp; <code>Ctrl</code> — fire &nbsp;•&nbsp; <code>Space</code> — open doors / use</li>
        <li><code>1</code>–<code>7</code> — select weapon &nbsp;•&nbsp; <code>Esc</code> — menu &nbsp;•&nbsp; <code>Enter</code> — confirm</li>
    </ul>
    <p style="color:#888">Best on a desktop/laptop with a keyboard. On phones, use the on-screen
    keyboard button in the player toolbar. Tip: the shareware cheat <code>IDDQD</code> grants god mode.</p>
</div>

<script src="/assets/doom/js-dos.js"></script>
{% raw %}
<script>
(function () {
    Dos(document.getElementById("dos"), {
        url: "/assets/doom/doom.jsdos",
        pathPrefix: "/assets/doom/emulators/",
        theme: "dark",
        backend: "dosbox",
        backendLocked: true,
        autoStart: false,
        noCloud: true,
        kiosk: false
    });
})();
</script>
{% endraw %}
