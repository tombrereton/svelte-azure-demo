import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EventGridPublisherClient, AzureKeyCredential } from "@azure/eventgrid";
import { TEEITUP_TOPIC_ENDPOINT, TEEITUP_TOPIC_KEY } from '$env/static/private';


async function SendEvent(): Promise<void> {
    const client = new EventGridPublisherClient(
        TEEITUP_TOPIC_ENDPOINT,
        "CloudEvent",
        new AzureKeyCredential(TEEITUP_TOPIC_KEY)
    );
    await client.send([
        {
            type: "azure.sdk.eventgrid.samples.cloudevent",
            source: "/azure/sdk/eventgrid/samples/sendEventSample",
            data: {
                message: "this is a sample event"
            }
        }
    ]);
}

export const POST: RequestHandler = async ({ request }) => {
    SendEvent().catch((err)=> {
        console.error("Event sending error:", err)
    })
    console.log("After event sent")
    const { a, b } = await request.json();
    return json(a + b);
};