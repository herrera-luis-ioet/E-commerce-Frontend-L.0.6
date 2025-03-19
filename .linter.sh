#!/bin/bash
cd /home/kavia/workspace/E-commerce-Frontend-L.0.6/productcatalogmanager
npx eslint --fix "$@"
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

