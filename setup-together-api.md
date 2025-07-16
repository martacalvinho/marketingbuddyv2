# Together.ai API Setup Instructions

To fix the Instagram image generation 500 error, you need to add the Together.ai API key to your .env file.

## Steps:

1. Open your `.env` file in the project root
2. Add this line to the file:

```
TOGETHER_API_KEY=fe5ad3067411ad7c15bfc3c42249599d92878c97252f888597e61dfbad3d2933
```

3. Save the file
4. Restart your development server (`npm run dev`)

## Your .env file should now contain:

```
OPENROUTER_API_KEY=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
TOGETHER_API_KEY=fe5ad3067411ad7c15bfc3c42249599d92878c97252f888597e61dfbad3d2933
```

After adding this key, the Instagram "Generate Image" button should work properly.
