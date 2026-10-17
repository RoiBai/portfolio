# Original Ambulance Rush recording

`ambulance-original-gameplay.webm` is a new **55-second**, **1280 × 720**, **30 fps**, silent recording of the published Unity WebGL game, captured in Chrome on 2026-10-18. Delivery codec: VP9 in WebM; file size: 6,766,614 bytes (6.45 MiB). The seekable delivery file includes duration metadata and a keyframe every two seconds. There is no audio track.

- Source: https://unisanewsgames.itch.io/ambulance-rush
- Published build: https://html-classic.itch.zone/html/11753425/ambulance%20rush%202%20oct-18/index.html

This take uses the original **Level 1 tutorial**: read Sam's patient briefing, open the hospital tab to inspect available beds, return to the patient tab, turn toward the route, then drive slowly along the street using the game's real keyboard controls. It demonstrates the interface and an approach to a patient; it does **not** depict a completed rescue or a successful mission. The tutorial's hospital labels are preserved exactly as the game displays them.

The game, models, game state, timers and traffic were not modified. The recording comes directly from the Unity canvas via `captureStream(30)` and `MediaRecorder`, followed by a 30 fps VP9 delivery encode. It is one continuous new take at normal speed: no reused old footage, artificial slow motion, generated frames, retouching, or scene substitutions. The poster is the actual frame at 35 seconds.

The new capture avoids the old accelerated presentation and uses a stable street route. The parked gray car remains visible without recurrent blanking in the inspected 6–15 second window. Full-video black-frame detection found no black intervals; first, middle, last and transition frames were checked. Normal traffic motion remains original gameplay.

The portfolio player defaults to **muted, 1× playback**, with controls and looping. It pauses offscreen and respects reduced motion. Both 1440 × 900 desktop and 390 × 844 mobile were checked for playback, duration, muting, reduced-motion pause and overflow.
