set -o errexit
client="admin-cli"
memberName="member_test"
memberSecret="test"

token=$(curl -f -k \
-d "client_id=${client}" \
-d "username=${memberName}" \
-d "password=${memberSecret}" \
-d "grant_type=password" \
https://localhost:8080/auth/realms/hivedrive/protocol/openid-connect/token \
| jq -r .access_token)

curl -f -k \
-H "Authorization: Bearer $token" \
https://localhost:8080/api/healthcheck/auth
