FROM postgis/postgis:16-3.4-alpine

RUN apk add --no-cache --virtual .build-deps git build-base clang15 llvm15 \
    && git clone --branch v0.7.4 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install \
    && cd .. && rm -rf pgvector \
    && apk del .build-deps
