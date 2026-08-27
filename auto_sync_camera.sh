#!/bin/bash
# Real-time DJI Action 5 Pro & Camera Auto-Sync to Google Drive
# Target Google Drive folder path
DRIVE_DIR="/Users/ganesh/Library/CloudStorage/GoogleDrive-princeganna525@gmail.com/My Drive/srilu_wedding_gallary"

# Ensure target Google Drive directory exists
mkdir -p "$DRIVE_DIR"

echo "=========================================================="
echo "⚡ AUTOMATED CAMERA AUTO-SYNC IS NOW ACTIVE!"
echo "Target Cloud Folder: $DRIVE_DIR"
echo "Watching for new photos & videos from connected camera..."
echo "=========================================================="

while true; do
  # Find ONLY photo files (.JPG, .PNG, .JPEG) across all mounted camera volumes/DCIM
  for file in /Volumes/*/DCIM/*/*.JPG /Volumes/*/DCIM/*/*.jpg /Volumes/*/DCIM/*/*.PNG /Volumes/*/DCIM/*/*.png /Volumes/*/DCIM/*/*.JPEG /Volumes/*/DCIM/*/*.jpeg /Volumes/*/*.JPG /Volumes/*/*.jpg /Volumes/*/*.PNG /Volumes/*/*.png; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
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
