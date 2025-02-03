### Create new package folder

Inside the new folder:

### Test build

After importing your new package, run npm run setup to find dependency issues.

### Update dockerfile

Under # Package files, insert:
COPY packages/mypackage/package-lock.json \
 packages/mypackage/package.json \
 ./packages/mypackage/

Under # We only build required deps and use a shared Dockerfile, but can't dynamically COPY in next stage, so ensure they exist
and RUN mkdir -p \
 packages/mypackage/dist \
 packages/mypackage/node_modules \

Under # Copy transpiled JS files from packages in stage 1 image

COPY --from=builder /www/packages/mypackage/package.json \
 /www/packages/mypackage/package-lock.json \
 ./packages/mypackage/
COPY --from=builder /www/packages/mypackage/dist ./packages/mypackage/dist/
COPY --from=builder /www/packages/mypackage/node_modules ./packages/mypackage/node_modules/

### Update Sonar

Add new sonar projectKey and projectName

### Push changes

Push local changes to check against pipeline
