const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_DYNAMODB_ENDPOINT_URL && {
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT_URL,
  }),
});

// Create document client for easier operations
const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = ddbDocClient;