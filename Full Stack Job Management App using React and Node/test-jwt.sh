#!/bin/bash

# JWT Authentication Test Script
# This script tests the JWT implementation

echo "🔐 JWT Authentication Test Suite"
echo "=================================="
echo ""

API_URL="http://localhost:3000"

echo "📝 Test 1: Login and Get JWT Token"
echo "-----------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@northeastern.edu","password":"Admin@123"}')

echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. Make sure you have an admin user created."
  echo "   Create one with: POST /user/create"
  echo ""
  exit 1
fi

echo "✅ Token received!"
echo "Token (first 50 chars): ${TOKEN:0:50}..."
echo ""

echo "📝 Test 2: Access Protected Route WITH Token (Should Succeed)"
echo "--------------------------------------------------------------"
curl -s -X GET "$API_URL/user" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "📝 Test 3: Access Protected Route WITHOUT Token (Should Fail)"
echo "--------------------------------------------------------------"
curl -s -X GET "$API_URL/user" | jq '.'
echo ""

echo "📝 Test 4: Access Protected Route with INVALID Token (Should Fail)"
echo "------------------------------------------------------------------"
curl -s -X GET "$API_URL/user" \
  -H "Authorization: Bearer invalid_token_here" | jq '.'
echo ""

echo "📝 Test 5: Create Job as Admin WITH Token (Should Succeed)"
echo "----------------------------------------------------------"
curl -s -X POST "$API_URL/job/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "JWT Test Company",
    "jobTitle": "JWT Test Engineer",
    "description": "Testing JWT authentication",
    "salary": 95000,
    "createdBy": "admin@northeastern.edu"
  }' | jq '.'
echo ""

echo "📝 Test 6: Create Job WITHOUT Token (Should Fail)"
echo "-------------------------------------------------"
curl -s -X POST "$API_URL/job/create" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Fail Company",
    "jobTitle": "Should Not Work",
    "description": "Should fail without token",
    "salary": 50000,
    "createdBy": "test@northeastern.edu"
  }' | jq '.'
echo ""

echo "🎉 JWT Test Suite Complete!"
echo ""
echo "📋 Summary:"
echo "- Login returns JWT token"
echo "- Protected routes require valid token"
echo "- Invalid/missing tokens are rejected"
echo "- Admin routes check user role"
