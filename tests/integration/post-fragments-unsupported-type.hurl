# Test posting an unsupported Content-Type
POST http://localhost:8080/v1/fragments
Content-Type: application/octet-stream
[BasicAuth]
user1@email.com:password1
`This should fail`

# Should get 415 Unsupported Media Type
HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Unsupported Content-Type"