#!/bin/zsh
# Build, render and mix one explainer video.
#   render.sh <project dir> [label]      → <project>/out/<label>.mp4 (default label: date-time)
# Also writes out/<label>.sheet.png: one frame per second, for the review.
set -e
HERE=${0:A:h}
DIR=${1:A}; LABEL=${2:-$(date +%Y-%m-%dT%H-%M)}
mkdir -p $DIR/out
bun $HERE/build.ts --project=$DIR
(cd $DIR/build && npx hyperframes render --fps=30 --output=$DIR/out/.$LABEL.voice.mp4 --quiet)
python3 -I $HERE/mix.py $DIR $DIR/out/.$LABEL.voice.mp4 $DIR/out/$LABEL.mp4
rm -f $DIR/out/.$LABEL.voice.mp4
ffmpeg -hide_banner -loglevel error -y -i $DIR/out/$LABEL.mp4 -vf "fps=1,scale=180:-2,tile=8x5:padding=2:color=red" -frames:v 1 $DIR/out/$LABEL.sheet.png
echo "✓ $DIR/out/$LABEL.mp4"
