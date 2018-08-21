FROM node:8-alpine
LABEL maintainer="Ocean Protocol <devops@oceanprotocol.com>"

RUN apk add --no-cache --update\
    bash\
    g++\
    gcc\
    gettext\
    git\
    krb5-dev\
    krb5-libs\
    krb5\
    make\
    python

COPY . /pleuston
WORKDIR /pleuston

RUN npm install -g npm serve
RUN npm install
RUN chmod +x /pleuston/scripts/docker-entrypoint.sh

# Default ENV values
# src/config.js
ENV KEEPER_SCHEME='http'
ENV KEEPER_HOST='localhost'
ENV KEEPER_PORT='8545'
ENV OCEAN_SCHEME='http'
ENV OCEAN_HOST='localhost'
ENV OCEAN_PORT='5000'
# scripts/docker-entrypoint.sh
ENV LISTEN_ADDRESS='0.0.0.0'
ENV LISTEN_PORT='0.0.0.0'

ENTRYPOINT ["/pleuston/scripts/docker-entrypoint.sh"]

# Expose listen port
EXPOSE 3000
