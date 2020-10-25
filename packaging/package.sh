#!/bin/bash

### eg. ./package.sh 1.0.0

if [[ $# -eq 0 ]] ; then
    echo Missing one argument with package version!
    exit 1
fi

echo Auto packaging for Custom Video Feed v$1
echo

echo Processing...
echo

rm -fr "cvf-v$1"
rm -f "cvf-v$1.zip"
rm -f "cvf-v$1.hash"
rm -f "temp-ls-ref.txt"

mkdir "cvf-v$1"

git checkout HEAD -- ../youtube-custom-feed/public/youtube-custom-feed/parameters.json

cp readme.txt "cvf-v$1/readme.txt"
cp ../LICENSE.txt "cvf-v$1/LICENSE.txt"
cp ../release-note.md "cvf-v$1/release-note.md"
cp -r ../youtube-custom-feed "cvf-v$1/youtube-custom-feed"

rm -f "cvf-v$1/youtube-custom-feed/db.json"
rm -fr "cvf-v$1/youtube-custom-feed/node_modules"
rm -fr "cvf-v$1/youtube-custom-feed/public/youtube-custom-feed"

mkdir "cvf-v$1/youtube-custom-feed/public/youtube-custom-feed"

cp "../youtube-custom-feed/public/youtube-custom-feed/parameters.json" "cvf-v$1/youtube-custom-feed/public/youtube-custom-feed/parameters.json"

echo Done!
echo

# Checks

echo Checking files...
echo

if cmp -s "ref-parameters.json" "cvf-v$1/youtube-custom-feed/public/youtube-custom-feed/parameters.json"; then
    echo JSON parameters file is OK!
    echo
else
    echo Wrong JSON parameters file!
    echo Check following contents with reference file:
    echo
    cat "cvf-v$1/youtube-custom-feed/public/youtube-custom-feed/parameters.json"
    exit 1
fi

ls -R "cvf-v$1" > "temp-ls.txt"
if cmp -s "ref-ls.txt" "temp-ls.txt"; then
    echo Files listing is OK!
    rm -f "temp-ls.txt"
    echo
else
    echo Wrong file listing!
    echo Check following contents with reference file:
    echo
    cat "temp-ls.txt"
    exit 1
fi

# Post process

zip -rq "cvf-v$1.zip" "cvf-v$1"

rm -fr "cvf-v$1"

echo Zip file is created: `readlink -f "cvf-v$1.zip"`
echo

echo Computing hash zip file...
echo

echo -n "SHA1 = " > "cvf-v$1.hash"
sha1sum "cvf-v$1.zip" >> "cvf-v$1.hash"
echo -n "SHA256 = " >> "cvf-v$1.hash"
sha256sum "cvf-v$1.zip" >> "cvf-v$1.hash"
echo -n "MD5 = " >> "cvf-v$1.hash"
md5sum "cvf-v$1.zip" >> "cvf-v$1.hash"
echo -n "CRC checksum = " >> "cvf-v$1.hash"
cksum "cvf-v$1.zip" >> "cvf-v$1.hash"

echo All done!
echo