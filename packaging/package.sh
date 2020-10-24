### eg. ./package.sh v1.0.0

rm -fr "cvf-$1"
rm -f "cvf-$1.zip"

mkdir "cvf-$1"

cp readme.txt "cvf-$1/readme.txt"
cp ../LICENSE.txt "cvf-$1/LICENSE.txt"
cp ../release-note.md "cvf-$1/release-note.md"
cp -r ../youtube-custom-feed "cvf-$1/youtube-custom-feed"

rm -f "cvf-$1/youtube-custom-feed/db.json"
rm -fr "cvf-$1/youtube-custom-feed/node_modules"
rm -fr "cvf-$1/youtube-custom-feed/public/youtube-custom-feed"

mkdir "cvf-$1/youtube-custom-feed/public/youtube-custom-feed"

cp parameters.json "cvf-$1/youtube-custom-feed/public/youtube-custom-feed/parameters.json"

zip -rq "cvf-$1.zip" "cvf-$1"

rm -fr "cvf-$1"