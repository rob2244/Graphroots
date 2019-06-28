#!/bin/bash

FILE='.env'

cat <<EOF > $FILE
PORT=#{port}#
SESSION_SECRET=#{sessionSecret}#
EOF