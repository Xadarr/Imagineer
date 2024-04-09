import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface Input {
    prompt: string;
    image?: string; // URL of the image
}

export async function POST(req: NextRequest) {
    try {

        const requestBody = await req.json();


        if (!requestBody || !requestBody.prompt) {
            return NextResponse.json({ error: 'Prompt parameter is missing in the request body' }, { status: 400 });
        }

        //input with prompt and optionally image
        const input: Input = { prompt: requestBody.prompt };
        if (requestBody.image) {
            input.image = requestBody.image;
        }

        // Send a request to the external API with the provided prompt and optional image
        const response = await axios.post("https://api.replicate.com/v1/predictions", {
            version: "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
            input: input,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        });


        return NextResponse.json(await response.data, { status: 201 });
    } catch (error) {

        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
