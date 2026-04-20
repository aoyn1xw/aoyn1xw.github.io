Drop your custom hub images in this folder.

Expected files:
- background.mp4 -> full-page background video for the profile hub
- cursor.webp -> custom cursor image
- avatar.png -> profile avatar image (optional, falls back to GitHub avatar)
- background.jpg -> optional fallback image if video is missing or fails

Notes:
- Keep the video optimized for web playback (H.264 MP4 is recommended).
- If you use different names, update LOCAL_ASSETS in src/components/sections/profile-hub.tsx.
