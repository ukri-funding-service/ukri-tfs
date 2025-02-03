#!/bin/bash
die () {
    echo >&2 "$@"
    exit 1
}
[ "$#" -eq 1 ] || die "Requires release number './release 1.145', $# provided"

cd "$(dirname "$0")"
rm -rf ukri-tfs-schemas
git clone git@bitbucket.org:ukri-ddat/ukri-tfs-schemas.git
rm -rf ukri-tfs-schemas/*/
rm -f schema.zip
npm i && npm run docs
cd ukri-tfs-schemas

if [[ `git status --porcelain` ]]; then
    git add -A && git commit -m "docs: publish schemas"
    git push
else
    echo No changes since last release
fi
git tag -a "$1" -m "TFS release $1" && git push origin "$1"
cd ../
rm -rf ukri-tfs-schemas
