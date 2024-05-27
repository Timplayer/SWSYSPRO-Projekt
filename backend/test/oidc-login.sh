set -o errexit
client="admin-cli"
memberName="member_test"
memberSecret="test"

token=$(curl -k \
-d "client_id=${client}" \
-d "username=${memberName}" \
-d "password=${memberSecret}" \
-d "grant_type=password" \
https://localhost:8080/auth/realms/hivedrive/protocol/openid-connect/token \
| jq .access_token)

curl -k \
-H "Authorization: Bearer $token" \
https://localhost:8080/api/test/auth