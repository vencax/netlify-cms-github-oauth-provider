#! /usr/bin/env bash
set -e

# Clean up build assets, to save disk space.
pkg="product-manual-$BRANCH_NAME-assets.tar.gz"
rm -rf $pkg
rm -rf public
