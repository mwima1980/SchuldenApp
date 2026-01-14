"use strict";

var typs = document.getElementById("typs");

var typewriter = new Typewriter(typs, {
  loop: true,
});

typewriter
  .typeString("Schuldenübersicht")
  .pauseFor(1000)
  .deleteAll()
  // .typeString("Strings can be removed")
  // .pauseFor(1000)
  // .deleteChars(7)
  // // .typeString("<strong>altered!</strong>")
  // .pauseFor(1000)
  .start();
