import { OpenAIStreamPayload, openAIStream } from '@/utils/OpenAIStrean';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const errorResponse = (status: number, message = 'Something went wrong') => {
  const responseBody = {
    status,
    message,
  };
  return new Response(JSON.stringify(responseBody), { status });
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return errorResponse(405, 'Method Not Allowed');
  }

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse(500, 'OpenAI API is not properly configured');
  }

  // Destructure keywords from the request
  const { keywords } = await req.json();

  // Return if keywords is not valid
  if (typeof keywords !== 'string') {
    return errorResponse(400, 'Invalid request');
  }

  if (keywords === '') {
    return errorResponse(400, 'Please provide some keywords');
  }

  console.log(keywords);

  // Prepare the user message for OpenAI Chat API.
  const prompt = `[reply only with a comma separated names list without any numbering] Generate 100 brandable names that can be described with the following keywords: ${keywords}`;

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    stream: true,
    n: 1,
  };

  const stream = await openAIStream(payload);
  return new Response(stream);
}
