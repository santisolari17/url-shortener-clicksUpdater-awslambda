export const deleteEvents = async (eventIds, dynamoClient) => {
  const deleteBatchSize = 5;
  const chunks = splitArrayIntoChunks(eventIds, deleteBatchSize);
  
  for (const ids of chunks) {
      const deleteRequests = ids.map(id => ({
      DeleteRequest: {
          Key: {
            eventId: id,
          },
        },
      }));
    
      const params = {
        RequestItems: {
          appEvents: deleteRequests,
        },
      };
      
      await dynamoClient.batchWrite(params);
  }
  

  console.log(`Deleted processed events. Number of events deleted: ${eventIds.length}`);
}

function splitArrayIntoChunks(array, chunkSize) {
const result = [];
for (let i = 0; i < array.length; i += chunkSize) {
  const chunk = array.slice(i, i + chunkSize);
  result.push(chunk);
}
return result;
}