set -o errexit
number=$RANDOM

curl -k -f -v -X POST https://localhost:8080/api/healthcheck/sql/$number
retnum=$(curl -v -k https://localhost:8080/api/healthcheck/sql)
echo $retnum
[[ $retnum = "$number" ]]
exit $?
