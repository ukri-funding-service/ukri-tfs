FROM docker-tfs.devops.innovateuk.org/tfs/node:20.18.2-alpine3.20 AS builder
RUN npm install --global npm@10.8.2

WORKDIR /usr/src/app

# Install build dependencies
RUN apk update \
        && apk add --no-cache \
        --virtual build-dependencies \
        pkgconfig \
        python \
        make \
        g++ \
        gcc \
        pkgconfig \
        pixman-dev \
        cairo-dev \
        pango-dev \
        libjpeg-turbo-dev \
        giflib-dev \
        && rm -rf /var/cache/apk/*

# Install package
RUN npm set ${NPM_REPO}:_authToken ${NPM_AUTH_TOKEN} && \
        npm i --no-save --registry=https:${NPM_REPO} ukri-test-framework@${VERSION}
RUN chmod 0755 node_modules/@ukri-tfs/test-framework/scripts/*.sh

#### Prod image ####
FROM docker-tfs.devops.innovateuk.org/tfs/node:20.18.2-alpine3.20 AS prod-image
RUN npm install --global npm@10.8.2

WORKDIR /usr/src/app

ARG TZ="Europe/London"

COPY --from=builder /usr/src/app/node_modules ./node_modules

# Install packages required by tests
RUN apk update \
        && apk add --no-cache xclip \
        && rm -rf /var/cache/apk/*

# Create dirs required by tests
RUN mkdir -p \
        _results_ \
        tests/API/logfiles/ \
        tests/API/logs/ \
        tests/API/output \
        tests/API/output/logs \
        tests/API/output/reports \
        tests/API/reports \
        tests/Performance/results \
        tests/UI/helpers/locators \
        tests/UI/helpers/contentMappers \
        tests/UI/helpers/steps \
        tests/UI/logs \
        tests/UI/output/ \
        tests/UI/output/accessibility/ \
        tests/UI/output/imageComparison/ \
        tests/UI/output/imageComparison/actual \
        tests/UI/output/imageComparison/baseline \
        tests/UI/output/imageComparison/diff \
        tests/UI/output/imageComparison/screenshot \
        tests/UI/output/junit/ \
        tests/UI/output/logs/ \
        tests/UI/output/reports/ \
        tests/UI/output/selenium/ \
        tests/UI/output/screenshots/ \
        tests/UI/output/videos/ \
        tests/UI/output/webdriverio/  \
        tests/UI/reports/ \
        tests/UI/reports/accessibility/ \
        tests/UI/reports/logs/ \
        tests/UI/reports/reports/ \
        tests/UI/reports/screenshots/ \
        tests/UI/reports/videos/

ENV PATH "/usr/src/app/node_modules/.bin:${PATH}"

ENTRYPOINT ["ukri-test-framework"]
CMD ["--help"]

