set -o errexit
for (( i = 0; i < 20; i++ )); do
    id=$(curl -k -v -X POST \
         -H "Content-Type: application/json" \
         -d '{"name":"test5"}' \
         https://localhost:8080/api/stations \
         | jq -r .id)

    retnum=$(curl -f -k \
    https://localhost:8080/api/stations/id/$id \
    | jq -r .id)
    if [[ $retnum != "$id" ]] ; then
        [[ $retnum = "$id" ]]
        exit $?
    fi
done
