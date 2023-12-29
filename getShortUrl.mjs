export const getShortUrl = async (urlId, dynamoClient) => {
  let result;
  const params = {
      TableName: 'shortUrls',
      KeyConditionExpression: `urlId = :val`,
      ExpressionAttributeValues: {
        ':val': urlId,
      },
  };
  
  result = await dynamoClient.query(params);
  
  return result.Items[0]
}