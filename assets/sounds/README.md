# Sound effects for Khafī

The app **already plays sounds** using short remote URLs when **Sound** is on in Settings (timer end, reveal, correct/wrong).

## Using your own audio files

1. Add MP3 (or WAV/M4A) files here:
   - `tick.mp3` – timer tick (optional)
   - `timeup.mp3` – when the discussion timer ends
   - `reveal.mp3` – when the user taps "Reveal Results"
   - `correct.mp3` – when the user taps "Yes" (we got the imposter)
   - `wrong.mp3` – when the user taps "No" (imposters won)

2. In `utils/soundEffects.ts`, change `playOne()` to load from `require()` instead of URLs, e.g.:

   ```ts
   const soundMap = {
     tick: require('../assets/sounds/tick.mp3'),
     timeup: require('../assets/sounds/timeup.mp3'),
     // ...
   };
   const { sound } = await Audio.Sound.createAsync(soundMap[soundKey]);
   await sound.playAsync();
   ```

3. Keep clips short (about 0.5–2 seconds) so the app stays responsive.
