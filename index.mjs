import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getClickEvents } from './getClickEvents.mjs'
import { updateClicks } from './updateClicks.mjs'
import { deleteEvents } from './deleteEvents.mjs'

const dynamo = DynamoDBDocument.from(new DynamoDB());


export const handler = async (event) => {
    let result;
    
    try {
        const clickEvents = await getClickEvents(dynamo);
        if (!clickEvents) {
            return { nothingToUpdate: true };
        }
        await updateClicks(clickEvents, dynamo);
        await deleteEvents(clickEvents.eventsIds, dynamo);
        result = { updated: clickEvents.clickEvents.length, deletedEvents: clickEvents.eventsIds.length };
    } catch (err) {
        result = err.message;
    } finally {
        console.log('Done!');
    }

    return result;
};