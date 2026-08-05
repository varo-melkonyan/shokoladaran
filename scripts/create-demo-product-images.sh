#!/bin/zsh
set -e

output_dir="public/assets/uploads/catalog"
mkdir -p "$output_dir"

sources=(
  "public/assets/uploads/demo/assorted-gift-box.webp"
  "public/assets/uploads/demo/dark-almond-bar.webp"
  "public/assets/uploads/demo/raspberry-truffles.webp"
  "public/assets/uploads/demo/pistachio-pralines.webp"
  "public/assets/uploads/demo/white-berry-chocolate.webp"
  "public/assets/uploads/demo/apricot-orange-chocolate.webp"
  "public/assets/uploads/demo/kids-animals.webp"
  "public/assets/uploads/demo/kids-lollipops.webp"
  "public/assets/uploads/demo/kids-surprise.webp"
  "public/assets/uploads/demo/caramel.webp"
  "public/assets/uploads/demo/dragees.webp"
  "public/assets/uploads/demo/wedding.webp"
)
accents=("8B4513" "A52A2A" "B8860B" "6B8E23" "C05A72" "8A5A44" "D2691E" "7A3E65")

for index in {1..150}; do
  source_index=$(( (index - 1) % 12 + 1 ))
  source_image=${sources[$source_index]}
  hue=$(( (index * 7) % 36 - 18 ))
  saturation=$(awk "BEGIN { printf \"%.2f\", 0.88 + (($index % 9) * 0.035) }")
  brightness=$(awk "BEGIN { printf \"%.3f\", -0.045 + (($index % 7) * 0.014) }")
  zoom=$(awk "BEGIN { printf \"%.3f\", 1.02 + (($index % 11) * 0.013) }")
  x_shift=$(( (index * 23) % 90 ))
  y_shift=$(( (index * 31) % 90 ))
  angle=$(awk "BEGIN { printf \"%.4f\", (($index % 7) - 3) * 0.004 }")
  accent_index=$(( (index - 1) % 8 + 1 ))
  accent=${accents[$accent_index]}
  filename=$(printf "product-%03d.webp" "$index")

  ffmpeg -hide_banner -loglevel error -y -i "$source_image" \
    -vf "scale=720*${zoom}:720*${zoom},crop=640:640:${x_shift}:${y_shift},hue=h=${hue}:s=${saturation},eq=brightness=${brightness}:contrast=1.03,rotate=${angle}:fillcolor=0xF7F0E8,drawbox=x=0:y=0:w=640:h=10:color=0x${accent}@0.82:t=fill" \
    -quality 76 "$output_dir/$filename"
done
