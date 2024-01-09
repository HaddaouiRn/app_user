#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u root -p'rania' -e 'SELECT 1'; do
  >&2 echo "MariaDB is unavailable - sleeping"
  sleep 1
done

>&2 echo "MariaDB is up - executing command"
exec $cmd

