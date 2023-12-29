export const updateClicks = async (events, dynamoClient) => {
  let params;
  let tableName = events.referenceTable;
  let tableProperty = events.referenceProperty;
  
  for (const event of events.clickEvents) {
      params = {
        TableName: tableName,
        Key: { [tableProperty]: event.eventReferenceId },
        UpdateExpression: 'SET clicks = clicks + :clicks, lastVisited = :lastVisited',
        ExpressionAttributeValues: {
          ':clicks': event.clicks,
          ':lastVisited': event.lastVisited,
        },
      }
          
      await dynamoClient.update(params);
      console.log(`Updated! ${event.eventReferenceId}. clicks: +${event.clicks} - lastVisited: ${event.lastVisited}`);
  }
}