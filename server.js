require('dotenv').config();

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const knowledgeBase = require('./knowledgebase');

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {

  const userMessage = req.body.message;

  try {

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [

        {
          role: 'system',

          content: `
You are the Creamy.Digital AI Assistant.

Use this knowledge base:

${knowledgeBase}

Speak professionally, strategically, warmly, and conversationally.

Focus on:
- SEO
- websites
- business growth
- lead generation
- visibility
- marketing systems
`
        },

        {
          role: 'user',
          content: userMessage
        }

      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: 'Something went wrong.'
    });

  }

});

app.get('/', (req, res) => {
  res.send('Creamy.Digital AI server is running.');
});

app.listen(3000, () => {
  console.log('Creamy chatbot server running on port 3000');
});
