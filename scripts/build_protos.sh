#!/usr/bin/env bash

write_to_dest() {
    local PROTO_DEST="$1"
    rm -rf "${PROTO_DEST}"
    mkdir -p "${PROTO_DEST}"

    # JavaScript code generation
    yarn run grpc_tools_node_protoc \
        --js_out=import_style=commonjs,binary:${PROTO_DEST} \
        --grpc_out=${PROTO_DEST} \
        --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
        -Isrc/protos \
        src/protos/*.proto

    # TypeScript code generation
    yarn run grpc_tools_node_protoc \
        --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
        --ts_out=${PROTO_DEST} \
        -Isrc/protos \
        src/protos/*.proto
}

if ! command -v realpath &> /dev/null; then
    echo 'realpath is not available. If you'"'"'re using MacOS, try `brew install coreutils`'
    exit 1
fi

BASEDIR=$(dirname $(dirname $(realpath "$0")))
echo "BASEDIR => ${BASEDIR}"
cd "${BASEDIR}/server"

SERVER_DEST="${BASEDIR}/server/src/generated"
CLIENT_DEST="${BASEDIR}/cli-client/src/generated"

write_to_dest "${SERVER_DEST}" || exit 1
write_to_dest "${CLIENT_DEST}" || exit 1

### gRPC-web
WEB_CLIENT_DEST="${BASEDIR}/client/src/generated"
rm -rf ${WEB_CLIENT_DEST} && mkdir -p ${WEB_CLIENT_DEST}
protoc -Isrc/protos \
    --js_out=import_style=commonjs:${WEB_CLIENT_DEST} \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:${WEB_CLIENT_DEST} \
    src/protos/*.proto

## gRPC Web for Flutter Client
FLUTTER_WEB_DEST="${BASEDIR}/flutter_client/lib/generated"
rm -rf "${FLUTTER_WEB_DEST}" && mkdir -p "${FLUTTER_WEB_DEST}"
# $ protoc --dart_out=grpc:lib/src/generated -Iprotos protos/echo.proto
protoc -Isrc/protos \
    --dart_out=grpc:${FLUTTER_WEB_DEST} \
    src/protos/*.proto