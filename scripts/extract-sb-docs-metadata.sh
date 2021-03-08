#!/bin/bash -

BRANCH='master'

MONOREPO_CODELOAD_URL='https://codeload.github.com/storybookjs/storybook/tar.gz'
DOCS_TAR_NAME="storybook-$BRANCH"
DOCS_REPO_SUBDIR='docs/'
DOCS_REPO_DEPTH=2 # number of dirs + 1
DOCS_REPO_DIRNAME='src/content/docs'

set -e

mkdir -p $DOCS_REPO_DIRNAME
rm -rf $DOCS_REPO_DIRNAME/*
curl $MONOREPO_CODELOAD_URL/$BRANCH | tar -zxvC $DOCS_REPO_DIRNAME --strip $DOCS_REPO_DEPTH $DOCS_TAR_NAME/$DOCS_REPO_SUBDIR


FRONTPAGE_CODELOAD_URL='https://codeload.github.com/storybookjs/frontpage/tar.gz'
FRONTPAGE_TAR_NAME="frontpage-$BRANCH"
FRONTPAGE_METADATA_FILENAME='site-metadata.js'
FRONTPAGE_REPO_DEPTH=1 # number of dirs + 1

set -e

rm -rf $FRONTPAGE_METADATA_FILENAME

curl $FRONTPAGE_CODELOAD_URL/$BRANCH | tar --strip-components $FRONTPAGE_REPO_DEPTH -zxv $FRONTPAGE_TAR_NAME/$FRONTPAGE_METADATA_FILENAME