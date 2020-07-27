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