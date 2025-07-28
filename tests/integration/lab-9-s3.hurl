# Lab 9 S3 Integration Test
# Test the complete lifecycle of a fragment with S3 storage

# 1. POST a new text fragment as an authorized user
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# 2. Confirm server returns 201 and capture Location header
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 9
[Captures]
url: header "Location"

# 3. GET the fragment using the captured URL as authorized user
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. Confirm server returns 200, correct type, and body
HTTP/1.1 200
Content-Type: text/plain
Content-Length: 9
[Asserts]
body == "Hello S3!"

# 5. DELETE the fragment using the URL as authorized user
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# 6. Confirm server returns 200
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"

# 7. Try to GET the fragment again
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 8. Confirm server returns 404 since fragment should be deleted
HTTP/1.1 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404