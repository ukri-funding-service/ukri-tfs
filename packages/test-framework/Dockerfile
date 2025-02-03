FROM docker-tfs.devops.innovateuk.org/tfs/flyway/flyway:10 AS builder

ARG NPM_REPO=//devops.innovateuk.org/binaries/repository/npm-group/
ARG NPM_AUTH_TOKEN

WORKDIR /usr/src/app

# Fail image build if NPM_AUTH_TOKEN has not been provided
RUN test -n "${NPM_AUTH_TOKEN}" || (echo "ERROR: NPM_AUTH_TOKEN not set" && false)

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

# Create dist
COPY package.json README.md ./
COPY ./src ./src
RUN npm set ${NPM_REPO}:_authToken ${NPM_AUTH_TOKEN} && \
        npm config set @ukri-tfs:registry https:${NPM_REPO} && \
        npm i
RUN npm run pushdist

# Install from dist
WORKDIR /usr/src/app/build
RUN npm init -y && \
        PACK=$(npm pack ../dist) && \
        npm i --production ${PACK}

RUN chmod 0755 node_modules/@ukri-tfs/test-framework/scripts/*.sh

#### Prod image ####
FROM docker-tfs.devops.innovateuk.org/tfs/flyway/flyway:10

WORKDIR /usr/src/app

ARG TZ="Europe/London"

COPY --from=builder /usr/src/app/build/node_modules ./node_modules
COPY ./dockerfiles/ ./

# Install packages required by tests
RUN apk update \
        && apk add --no-cache xclip \
        && rm -rf /var/cache/apk/*

# Create dirs required by tests
RUN mkdir -p \
        _results_ \
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
        tests/UI/output/accessibility \
        tests/UI/output/logs \
        tests/UI/output/screenshots \
        tests/UI/reports/accessibility \
        tests/UI/reports/allure-results

ENV PATH "/usr/src/app/node_modules/.bin:${PATH}"

ENTRYPOINT ["ukri-test-framework"]
CMD ["--help"]
