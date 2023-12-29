# url-shortener-clicksUpdater-awslambda

Serverless function that processes the application click events stored in the `appEvents` dynamoDB table of type `IncreaseClickEvent` to update shorten url information about:

* Clicks per shortened Url
* Last Visited date of a short url

the serverless function processes the events in in order of occurrence to avoid race conditions on update.

## Lambda function specs

* Name: clicksUpdater
* Runs every 1 minute.
* Processes 20 events per execution.
* Deletes processed events from the `appEvents` table in batches of 5.