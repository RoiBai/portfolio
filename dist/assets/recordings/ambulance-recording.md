# Ambulance Rush — user-supplied recording

The page uses the complete recording supplied by the project creator on 2026-10-18: `螢幕錄製 2026-10-18 上午2.23.49.mov`.

- Original: 3402 × 2144, 265.376667 seconds, H.264, no audio track, 2,014,596,425 bytes.
- Delivery: `ambulance-user-gameplay.mp4`, 1440 × 908, 30 fps, H.264, 265.40 seconds, no audio track, 61,128,420 bytes.
- Delivery retains the entire recording and its aspect ratio. No scenes were fabricated, reordered or removed.
- The webpage initializes `defaultPlaybackRate` and `playbackRate` at 1.5, so the full recording plays in about 176.9 seconds.
- Conversion: Lanczos downscale, libx264 CRF 23 / fast, YUV420p, fast-start MP4.
- Poster: the first frame of the supplied recording.

First two seconds, last two seconds and two midpoints were visually checked in the delivered file.

## Playable game audio

The separate interactive game uses the original published Unity build, mirrored byte-for-byte from the project’s itch.io build because that host does not permit cross-origin asset loading. Its audio output is routed through a zero-gain Web Audio node before Unity starts. Audio contexts remain running, so game logic and audio timing are not suspended. HTML audio elements, if any are used, are also muted within this game frame. The source build and hashes are recorded in `../ambulance-game/build-source.json`.

## Focused capacity sequence · 2026-10-20

The webpage now shows one continuous 57-second excerpt, original source **02:43–03:40** (`ambulance-capacity-sequence.mp4`). The complete recording above is retained. At the webpage’s unchanged 1.5× playback rate, the excerpt lasts 38 seconds. No scenes were reordered or invented.

Verified directly in source frames:
- 02:45: Lucas pickup prompt.
- 02:50: `Hospital Full` / `No beds available` message while Lucas is the current patient.
- 03:00: all three hospital capacity values are 0.
- 03:15: Flinders Medical Centre has 1 bed; the other hospitals have 0.
- 03:35: Lucas delivery countdown at Flinders, while his deadline still has time remaining.

Delivery: original 1440×908 frame size, libx264 CRF 22 / fast, YUV420p, fast-start MP4, no audio. Poster is the original 02:50 frame. This excerpt makes the capacity decision concrete; the annotated full-interface figure remains the instruction guide.
