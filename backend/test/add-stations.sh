set -o errexit
for (( i = 0; i < 20; i++ )); do
    id=$(curl -f -k \
    -X POST \
    https://localhost:8080/api/stations/name/test3)

    retnum=$(curl -f -k \
    https://localhost:8080/api/stations/id/$id \
    | jq -r .id)
    if [[ $retnum = "$id" ]] ; then
        [[ $retnum = "$id" ]]
        exit $?
    fi
done
