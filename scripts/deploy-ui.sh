#!/bin/bash

cd "$(dirname "$0")"/..
source .env

export AWS_PROFILE

aws \
  s3 sync \
  --region $UI_S3_REGION \
  --acl public-read \
  --sse \
  --delete \
  front/app/dist/ $UI_S3_BUCKET_URI

aws \
  cloudfront \
  create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths '/*'

# git rev-parse --verify HEAD
# git diff-index --quiet HEAD --
