# Pollinations.AI API Documentation 

## Cheatsheet

### Text Generation API (Default model: 'openai')

Generate (GET): `GET https://text.pollinations.ai/{prompt}`
- Params: prompt*, model, seed, json, system, private
- Return: Generated text

Generate (POST): `POST https://text.pollinations.ai/`
- Body: messages*, model, seed, jsonMode
- Return: Generated text

OpenAI Compatible: `POST https://text.pollinations.ai/openai`
- Body: Follows OpenAI ChatGPT API format
- Return: OpenAI-style response

List Models: `GET https://text.pollinations.ai/models`


### React Hooks (`npm install @pollinations/react`)

usePollinationsText(prompt, options)
- Options: seed, model, systemPrompt
- Return: string | null

usePollinationsImage(prompt, options)
- Options: width, height, model, seed, nologo, enhance
- Return: string | null

usePollinationsChat(initialMessages, options)
- Options: seed, jsonMode, model
- Return: { sendUserMessage: (message) => void, messages: Array<{role, content}> }

Docs: https://pollinations.ai/react-hooks

## Detailed API Documentation

### Text Generation API

#### Generate (GET)
`GET https://text.pollinations.ai/{prompt}`

**Parameters:**
- prompt* (required): Text prompt for the AI to respond to. Should be URL-encoded.
- model: Model to use for text generation. Options: 'openai', 'mistral'. See https://text.pollinations.ai/models for available models.
- seed: Seed for reproducible results.
- json: Set to 'true' to receive response in JSON format.
- system: System prompt to set the behavior of the AI. Should be URL-encoded.
- private: Set to 'true' to prevent the response from appearing in the public feed. Default: false

**Return:** Generated text

#### Generate (POST)
`POST https://text.pollinations.ai/`

**Request Body:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is artificial intelligence?"}
  ],
  "model": "openai",
  "seed": 42,
  "jsonMode": true,  // Optional: Forces the response to be valid JSON
  "private": true    // Optional: Prevents response from appearing in public feed
}
```

**Return:** Generated text

#### Vision Capabilities
The following models support analyzing images through our API:
- `openai`
- `openai-large`
- `claude-hybridspace`

You can pass images either as URLs or base64-encoded data in the messages. See the [OpenAI Vision Guide](https://platform.openai.com/docs/guides/vision) for detailed documentation on the message format.

Note: While we offer other models like Gemini, they currently do not support multimodal (image) inputs.

Example message format with image:
```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "What's in this image?"},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg"
          }
        }
      ]
    }
  ],
  "model": "openai"
}
```

#### Example Usage (GET)

```
https://text.pollinations.ai/What%20is%20artificial%20intelligence?seed=42&json=true&model=mistral&system=You%20are%20a%20helpful%20AI%20assistant
```

## Code Examples

### JavaScript (Text Generation)

```javascript
const fetch = require('node-fetch');

async function generateText() {
  const response = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is artificial intelligence?' }
      ],
      seed: 42,
      model: 'mistral'
    }),
  });

  const data = await response.json();
  console.log(data);
}

generateText();
```
# ⚠ WARNING : please note that pollinations AI forgot conversstaions after page refresh

# Pollinations.AI API Usage in PromptEnhancer

This project uses the Pollinations.AI API to enhance prompts using their text generation capabilities.

## API Endpoints Used

### Text Generation (POST)
`POST https://text.pollinations.ai/`

**Request Format:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Enhance this prompt: {prompt}"}
  ],
  "model": "openai",
  "seed": 42,
  "jsonMode": true
}
```

**Return:** Enhanced prompt text