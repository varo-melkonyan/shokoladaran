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
  unique_r=$(( (index * 53) % 206 + 25 ))
  unique_g=$(( (index * 97) % 206 + 25 ))
  unique_b=$(( (index * 149) % 206 + 25 ))
  unique_color=$(printf "%02X%02X%02X" "$unique_r" "$unique_g" "$unique_b")
  layout=$(( ((index - 1) / 12) % 6 ))
  filename=$(printf "product-%03d.webp" "$index")

  case $layout in
    0) filter="scale=720*${zoom}:720*${zoom},crop=640:640:${x_shift}:${y_shift},hue=h=${hue}:s=${saturation},eq=brightness=${brightness}:contrast=1.03" ;;
    1) filter="scale=550:550,hue=h=${hue}:s=${saturation},pad=640:640:45:45:0xF4E8DC,drawbox=x=20:y=20:w=600:h=600:color=0x${accent}@0.95:t=12" ;;
    2) filter="scale=720:720,crop=640:640:${x_shift}:${y_shift},hue=h=${hue}:s=${saturation},drawbox=x=0:y=0:w=105:h=640:color=0x${accent}@0.82:t=fill,drawbox=x=105:y=0:w=8:h=640:color=white@0.75:t=fill" ;;
    3) filter="scale=720:720,crop=640:640:${x_shift}:${y_shift},hue=h=${hue}:s=${saturation},drawbox=x=0:y=500:w=640:h=140:color=0x${accent}@0.84:t=fill,drawbox=x=0:y=488:w=640:h=12:color=white@0.72:t=fill" ;;
    4) filter="scale=760:760,crop=640:640:${x_shift}:${y_shift},hue=h=${hue}:s=${saturation},vignette=PI/5,drawbox=x=0:y=0:w=640:h=640:color=0x${accent}@0.78:t=18" ;;
    *) filter="scale=720:720,crop=640:640:${x_shift}:${y_shift},hue=h=${hue}:s=${saturation},eq=brightness=${brightness}:contrast=1.08,drawbox=x=36:y=36:w=568:h=568:color=white@0.64:t=6,drawbox=x=48:y=48:w=544:h=544:color=0x${accent}@0.72:t=8" ;;
  esac
  filter="${filter},drawbox=x=0:y=636:w=640:h=4:color=0x${unique_color}@0.95:t=fill"

  ffmpeg -hide_banner -loglevel error -y -i "$source_image" -vf "$filter" -quality 76 "$output_dir/$filename"
done
