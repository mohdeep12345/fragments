# Lab 10 DynamoDB Integration Test
# Test the complete lifecycle of fragments with DynamoDB metadata storage

# 1. POST a new JSON fragment as an authorized user
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{ "service": "DynamoDB" }

# 2. Confirm server returns 201 and capture Location header and fragment ID
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. GET the fragment info (metadata) for the first fragment
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

# 4. Confirm server returns 200 and metadata matches expectations
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment1_id}}"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25
jsonpath "$.fragment.created" exists
jsonpath "$.fragment.updated" exists

# 5. POST a second Markdown fragment as the same authorized user
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**.`

# 6. Confirm server returns 201 and capture Location header and fragment ID
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 21
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 7. GET the fragment info (metadata) for the second fragment
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

# 8. Confirm server returns 200 and metadata matches expectations
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment2_id}}"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 21
jsonpath "$.fragment.created" exists
jsonpath "$.fragment.updated" exists

# 9. GET all fragments for the user (IDs only)
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

# 10. Confirm both fragment IDs are in the list
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"

# 11. DELETE the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 12. Confirm server returns 200
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"

# 13. Try to GET the first fragment again
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 14. Confirm server returns 404 since fragment should be deleted
HTTP/1.1 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404

# 15. GET all fragments for the user again (IDs only)
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

# 16. Confirm first ID is NOT included but second ID is still there
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"
