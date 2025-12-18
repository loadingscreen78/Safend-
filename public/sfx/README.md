
# Sound Effects

This directory contains sound effect files that provide audio feedback for various user interactions.

## Required Sound Files

The following sound files need to be added to this directory for the sound system to work:

- **welcome_chime.mp3/ogg**: Soft welcome chime when user logs in (700ms)
- **ui_click.mp3/ogg**: Subtle tap sound for button clicks (120ms)
- **positive_tick.mp3/ogg**: Gentle "ding" for successful actions (250ms)
- **trash_swipe.mp3/ogg**: Light whoosh sound for deletions (300ms)
- **error_buzz.mp3/ogg**: Soft buzz for validation/API failure (350ms)
- **download_done.mp3/ogg**: Rising tone for completed exports (500ms)
- **notify_ping.mp3/ogg**: Calm ping for notifications (600ms)

## File Format Requirements

- Include both MP3 and OGG formats for cross-browser compatibility
- Keep files small (under 50KB if possible) for fast loading
- All sounds should be subtle and not jarring to the user

## Note

Until real sound files are added, the system will use a fallback mechanism that generates simple tones using the Web Audio API.
