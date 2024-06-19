#!/bin/bash
# https://stackoverflow.com/a/75660630
exec 3<>/dev/tcp/127.0.0.1/8080

echo -e "GET /auth/health/ready HTTP/1.1\nhost: 127.0.0.1:8080\n" >&3

timeout --preserve-status 1 cat <&3 | grep -m 1 status | grep -m 1 UP
ERROR=$?

exec 3<&-
exec 3>&-

exit $ERROR