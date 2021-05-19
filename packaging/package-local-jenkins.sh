#!/bin/bash

### Command line example: ./package.sh 1.0.0

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
rm -f "temp-ls.txt"

mkdir "cvf-v$1"

git checkout HEAD -- ../src/etc/apikeys.json
git checkout HEAD -- ../src/etc/channels.json

cp readme.txt "cvf-v$1/readme.txt"
cp ../LICENSE.txt "cvf-v$1/LICENSE.txt"
cp ../doc/release-note.md "cvf-v$1/release-note.md"
cp -r ../src "cvf-v$1/custom-video-feed"
cp ../package.json "cvf-v$1/package.json"

rm -fr "cvf-v$1/custom-video-feed/var"
rm -fr "cvf-v$1/custom-video-feed/node_modules"
rm -fr "cvf-v$1/custom-video-feed/etc"

mkdir "cvf-v$1/custom-video-feed/etc"
mkdir "cvf-v$1/custom-video-feed/var"

cp "../src/etc/apikeys.json" "cvf-v$1/custom-video-feed/etc/apikeys.json"
cp "../src/etc/channels.json" "cvf-v$1/custom-video-feed/etc/channels.json"

echo Done!
echo

# Checks

echo Checking files...
echo

if cmp -s "ref-apikeys.json" "cvf-v$1/custom-video-feed/etc/apikeys.json"; then
    echo JSON API keys parameters file is OK!
    echo
else
    echo Wrong JSON API keys parameters file!
    echo Check following contents with reference file:
    echo
    echo "Packaged file:"
    cat "../src/etc/apikeys.json"
    echo
    echo "Reference file:"
    cat "ref-apikeys.json"
    exit 1
fi

if cmp -s "ref-channels.json" "cvf-v$1/custom-video-feed/etc/channels.json"; then
    echo JSON channels parameters file is OK!
    echo
else
    echo Wrong channels keys parameters file!
    echo Check following contents with reference file:
    echo
    echo "Packaged file:"
    cat "../src/etc/channels.json"
    echo
    echo "Reference file:"
    cat "ref-channels.json"
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

zip a -r "cvf-v$1.zip" "cvf-v$1"

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