import { getShortUrl } from './getShortUrl.mjs'

export const getClickEvents = async (dynamoClient) => {
    let result;
    const params = {
      TableName: 'appEvents',
      IndexName: 'eventTypeIndex',
      KeyConditionExpression: 'eventType = :eventType',
      ExpressionAttributeValues: {
        ':eventType': 'IncreaseClickEvent',
      },
      Limit: 20,
      ScanIndexForward: true, // Sort in descending order based on lastVisited
    };
    
    result = await dynamoClient.query(params);
    
    if (result.Items.length === 0) {
        return null
    }
    
    const reduced = result.Items.reduce((acc, item) => {
      const { eventReferenceId, lastVisited } = item;
      const existingItem = acc[eventReferenceId];
    
      if (existingItem) {
        // If the current item has a more recent lastVisited date, update it
        if (new Date(lastVisited) > new Date(existingItem.lastVisited)) {
          existingItem.lastVisited = lastVisited;
        }
    
        // Increment the count
        existingItem.clicks += 1;
      } else {
        // Create a new item for the eventReferenceId
        acc[eventReferenceId] = {
          clicks: 1,
          lastVisited,
        };
      }
    
      return acc;
    }, {});
    
    // Convert the result back to an array
    let clickEvents = Object.entries(reduced).map(([eventReferenceId, { clicks, lastVisited }]) => ({
      eventReferenceId,
      clicks,
      lastVisited,
    }));
    
    const referenceTable = result.Items[0].eventTableReference;
    const referenceProperty = result.Items[0].eventTablePropertyReference;
    const eventsIds = result.Items.map(event => event.eventId);
    const keys = clickEvents.map(event => ({ urlId: event.eventReferenceId }));

    // Define the batchGetItem request parameters
    const batchParams = {
      RequestItems: {
        [referenceTable]: {
          Keys: keys,
        },
      },
    };
    
    const shorts = await dynamoClient.batchGet(batchParams);
    const shortsIds = [... shorts.Responses.shortUrls].map(short => short.urlId);
    
    // If the id doesn't exists in the shortUrls table, we remove it from the click events to update
    clickEvents = clickEvents.filter(event => shortsIds.includes(event.eventReferenceId));
    
    return {
        referenceTable,
        referenceProperty,
        clickEvents,
        eventsIds,
    }
}