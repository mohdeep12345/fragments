# Test posting a JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
```json
{
  "name": "test",
  "value": 123,
  "active": true
}
```

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
[Captures]
url: header "Location"

# GET the JSON fragment back
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
[Asserts]
jsonpath "$.name" == "test"
jsonpath "$.value" == 123
jsonpath "$.active" == true