# Original console audio recordings

Original console sounds: Sony Computer Entertainment. These are third-party recordings of the original PS2 effects, not a Sony-issued download or a BIOS extraction.

- `startup.mp3`: [PS2 Startup Screen - Sound Effect (HD)](https://www.youtube.com/watch?v=w5SoqjQR6eU), Gaming Sound FX. Range 0.38–10.88 seconds, preserving the complete startup and reverb decay. Stereo, 44.1 kHz, 160 kbps MP3; only silence trimmed and a 300 ms fade at the very end. No pitch shift, synthesis, or repetition.
- Legacy `move.mp3`, `enter.mp3`, and the active `back.mp3`: short excerpts from the user-supplied [PS2 Menu walkthrough](https://www.youtube.com/watch?v=HUyRfqJew1A), chaoreturnsforgood76. Source ranges 13.30–13.72, 16.92–17.72, 72.25–72.90 seconds respectively. Short edge fades and a 90 Hz high-pass filter; mono, 44.1 kHz, 96 kbps MP3.

- `ambience.mp3`: [PlayStation 2 System Menu Ambience for 2 hours](https://www.youtube.com/watch?v=Cxk1gI2sg3w), bit.whisperer. The uploader describes this as one continuous unedited recording. Source range 0:30–2:30, with no startup or menu selections. A stereo 112-second loop is built from that 120-second excerpt: play source seconds 8–112, then crossfade source seconds 112–120 into 0–8 with equal-power sine curves. The boundary resumes at source second 8; there is no silence or short repeated sample. Stereo, 44.1 kHz, 128 kbps MP3.

Startup and interaction cues play once per interaction. The menu's wave ambience fades in over three seconds beneath the startup's reverb tail, then plays continuously across site screens. It stops while replaying the intro or when muted/hidden, and fades back in when the menu becomes active again. Startup is decoded before the visual intro starts; its natural reverb tail can finish over the menu. Skip, mute, page hiding, and replay cancel previous playback. No BIOS files, video frames, logos, or spoken content are bundled.

## Reference menu cues

- `select.mp3`: downloaded unchanged from [imsaud.me/select.mp3](https://www.imsaud.me/select.mp3).
- `confirm.mp3`: downloaded unchanged from [imsaud.me/SelectChoice.mp3](https://www.imsaud.me/SelectChoice.mp3).

These replace movement and confirmation with the exact files requested from Saud’s reference site. The reference JavaScript maps them to menu navigation and selection, at gains of 0.4 and 0.25 on desktop; this site uses those same levels. Source inspected October 20, 2026. No license or original recording provenance was provided in the inspected page or bundle; this attribution does not imply a license grant. Back, startup, and ambience retain the recordings described above.
