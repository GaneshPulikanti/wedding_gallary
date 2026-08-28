#!/bin/bash
# Real-time Camera Auto-Sync to Google Drive
# Target Google Drive folder path
DRIVE_DIR="/Users/ganesh/Library/CloudStorage/GoogleDrive-princeganna525@gmail.com/My Drive/srilu_wedding_gallary"

# -------------------------------------------------------------------------
# CONFIGURATION TOGGLE:
# Set INCLUDE_DJI=true if you want to sync DJI files in the future.
# Set INCLUDE_DJI=false for DSLR/Nikon wedding photos only.
# -------------------------------------------------------------------------
INCLUDE_DJI=false

# Ensure target Google Drive directory exists
mkdir -p "$DRIVE_DIR"

echo "=========================================================="
echo "⚡ AUTOMATED CAMERA AUTO-SYNC IS NOW ACTIVE!"
echo "Target Cloud Folder: $DRIVE_DIR"
echo "Include DJI Files: $INCLUDE_DJI"
echo "Watching for new photos from connected camera..."
echo "=========================================================="

while true; do
  # Find photo & video files across mounted camera volumes
  for file in /Volumes/*/DCIM/*/*.JPG /Volumes/*/DCIM/*/*.jpg /Volumes/*/DCIM/*/*.JPEG /Volumes/*/DCIM/*/*.jpeg /Volumes/*/DCIM/*/*.MP4 /Volumes/*/DCIM/*/*.mp4 /Volumes/*/DCIM/*/*.MOV /Volumes/*/DCIM/*/*.mov; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")

      # Filter out DJI files if INCLUDE_DJI is set to false
      if [ "$INCLUDE_DJI" != "true" ]; then
        if [[ "$filename" == DJI_* ]] || [[ "$filename" == *.lrf ]] || [[ "$filename" == *.LRF ]] || [[ "$file" == *DJI* ]]; then
          continue
        fi
      fi

      # Check if file has not been synced yet
      if [ ! -f "$DRIVE_DIR/$filename" ]; then
        echo "📸 NEW ITEM DETECTED: $filename"
        echo "➡️ Transferring to Google Drive..."
        cp "$file" "$DRIVE_DIR/"
        echo "✅ Transferred! Uploading to cloud & live website..."
      fi
    fi
  done
  # Poll camera storage every 3 seconds
  sleep 3
done
