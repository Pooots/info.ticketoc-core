# Public Assets Directory

This folder contains static assets that will be copied to the `dist` folder during build.

## Required Files

Place the following files in this directory:

### Icons & Logos
- `favicon.ico` - Main favicon (16x16, 32x32, 48x48), same file as ticketoc.com
- `images/favicon_dark.ico` - Variant with a white clock face for dark backgrounds (hard to see on light browser tabs)
- `ticketoc_thumbnail.png` - App icon (362x362) used as the apple-touch icon, PWA icon and default social sharing image

### Configuration
- `manifest.json` - PWA manifest (already created)
- `robots.txt` - Search engine crawler instructions (already created)

### Folders
- `assets/` - Additional static assets (fonts, icons, etc.)
- `images/` - Image files used throughout the application

## Notes

- All files in this folder will be copied to `dist/` during `npm run build`
- Reference these files in your code using absolute paths (e.g., `/favicon.ico`)
- The `manifest.json` is already configured and ready to use
