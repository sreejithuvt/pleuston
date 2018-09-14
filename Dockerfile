FROM node:8-jessie
LABEL maintainer="Ocean Protocol <devops@oceanprotocol.com>"

RUN apt-get -y update &&\
    apt-get install -y\
    build-essential\
    g++\
    git\
    libcairo2-dev\
    libgif-dev\
    libjpeg-dev\
    libpango1.0-dev\
    xsel &&\
    apt-get -y clean

COPY . /pleuston
WORKDIR /pleuston

RUN npm update
RUN npm install -g npm serve
RUN npm install
RUN npm run build

# Default ENV values
# config/config.js
ENV KEEPER_SCHEME='http'
ENV KEEPER_HOST='localhost'
ENV KEEPER_PORT='8545'
ENV OCEAN_SCHEME='http'
ENV OCEAN_HOST='localhost'
ENV OCEAN_PORT='5000'
# scripts/docker-entrypoint.sh
ENV LISTEN_ADDRESS='0.0.0.0'
ENV LISTEN_PORT='3000'

ENTRYPOINT ["/pleuston/scripts/docker-entrypoint.sh"]

# Expose listen port
EXPOSE 3000
