# Botpress Payload Examples - All Content Types

## Overview
This guide shows you the exact payload structure for each content type in Botpress v12. Use these examples when sending messages via the API.

## 📝 Text Message

**Payload:**
```javascript
{
  type: 'text',
  text: 'Hello, how can I help you?',
  markdown: true  // Optional: enables markdown formatting
}
```

**With Typing Indicators:**
```javascript
{
  type: 'text',
  text: 'Hello!',
  typing: true  // Shows typing indicator before message
}
```

---

## 🖼️ Image

**Payload:**
```javascript
{
  type: 'image',
  image: 'https://example.com/image.jpg',  // URL or file path
  title: 'Image Title'  // Optional caption
}
```

**Examples:**
```javascript
// External URL
{
  type: 'image',
  image: 'https://picsum.photos/200/300',
  title: 'Random Image'
}

// Botpress media URL
{
  type: 'image',
  image: '/api/v1/bots/my-bot/media/abc123.jpg'
}
```

---

## 🎥 Video

**Payload:**
```javascript
{
  type: 'video',
  video: 'https://example.com/video.mp4',  // URL or file path
  title: 'Video Title'  // Optional caption
}
```

**Example:**
```javascript
{
  type: 'video',
  video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  title: 'Big Buck Bunny'
}
```

---

## 🎵 Audio

**Payload:**
```javascript
{
  type: 'audio',
  audio: 'https://example.com/audio.mp3',  // URL or file path
  title: 'Audio Title'  // Optional caption
}
```

**Example:**
```javascript
{
  type: 'audio',
  audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  title: 'Background Music'
}
```

---

## 📄 File

**Payload:**
```javascript
{
  type: 'file',
  file: 'https://example.com/document.pdf',  // URL or file path
  title: 'Document.pdf'  // Optional filename
}
```

**Example:**
```javascript
{
  type: 'file',
  file: '/api/v1/bots/my-bot/media/report.pdf',
  title: 'Monthly Report'
}
```

---

## 🗺️ Location

**Payload:**
```javascript
{
  type: 'location',
  latitude: 45.5017,
  longitude: -73.5673,
  address: '1234 Main St, Montreal, QC',  // Optional
  title: 'Our Office'  // Optional
}
```

**Example:**
```javascript
{
  type: 'location',
  latitude: 40.7128,
  longitude: -74.0060,
  address: 'New York, NY',
  title: 'New York City'
}
```

---

## 🃏 Card

**Payload:**
```javascript
{
  type: 'card',
  title: 'Card Title',
  subtitle: 'Card subtitle',  // Optional
  image: 'https://example.com/image.jpg',  // Optional
  actions: [  // Optional buttons
    {
      action: 'Say',
      title: 'Button 1',
      text: 'User clicked button 1'
    },
    {
      action: 'Open URL',
      title: 'Visit Website',
      url: 'https://example.com'
    }
  ]
}
```

**Example:**
```javascript
{
  type: 'card',
  title: 'Product Name',
  subtitle: '$99.99',
  image: 'https://example.com/product.jpg',
  actions: [
    {
      action: 'Say',
      title: 'Buy Now',
      text: 'I want to buy this product'
    },
    {
      action: 'Open URL',
      title: 'Learn More',
      url: 'https://example.com/product'
    }
  ]
}
```

---

## 🎠 Carousel

**Payload:**
```javascript
{
  type: 'carousel',
  items: [
    {
      title: 'Card 1',
      subtitle: 'Description 1',
      image: 'https://example.com/image1.jpg',
      actions: [
        {
          action: 'Say',
          title: 'Select',
          text: 'Selected card 1'
        }
      ]
    },
    {
      title: 'Card 2',
      subtitle: 'Description 2',
      image: 'https://example.com/image2.jpg',
      actions: [
        {
          action: 'Say',
          title: 'Select',
          text: 'Selected card 2'
        }
      ]
    }
  ]
}
```

---

## 🔘 Single Choice (Quick Replies)

**Payload:**
```javascript
{
  type: 'single-choice',
  text: 'Please select an option:',
  choices: [
    {
      title: 'Option 1',
      value: 'option1'
    },
    {
      title: 'Option 2',
      value: 'option2'
    },
    {
      title: 'Option 3',
      value: 'option3'
    }
  ]
}
```

**Example:**
```javascript
{
  type: 'single-choice',
  text: 'What would you like to do?',
  choices: [
    {
      title: 'Check Balance',
      value: 'check_balance'
    },
    {
      title: 'Transfer Money',
      value: 'transfer'
    },
    {
      title: 'Talk to Agent',
      value: 'agent'
    }
  ]
}
```

---

## 📋 Dropdown

**Payload:**
```javascript
{
  type: 'dropdown',
  message: 'Please select from the dropdown:',
  buttonText: 'Choose an option',
  options: [
    {
      label: 'Option 1',
      value: 'opt1'
    },
    {
      label: 'Option 2',
      value: 'opt2'
    }
  ],
  width: 300,  // Optional
  displayInKeyboard: true,  // Optional
  allowCreation: false,  // Optional
  allowMultiple: false,  // Optional
  markdown: true  // Optional
}
```

---

## 📦 JSON (Custom Data)

**Payload:**
```javascript
{
  type: 'json',
  title: 'Custom Data',  // Optional
  json: {
    // Any JSON object
    key: 'value',
    nested: {
      data: 'here'
    }
  },
  text: 'Preformatted text'  // Optional alternative to json
}
```

**Examples:**
```javascript
// Send structured data
{
  type: 'json',
  title: 'User Profile',
  json: {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  }
}

// Send preformatted text
{
  type: 'json',
  title: 'Code Snippet',
  text: 'function hello() {\n  console.log("Hello!");\n}'
}
```

---

## 🛍️ Products

**Payload:**
```javascript
{
  type: 'products',
  products: [
    {
      name: 'Product 1',
      price: 99.99,  // Can be number or string
      image: 'https://example.com/product1.jpg'
    },
    {
      name: 'Product 2',
      price: '149.99',
      image: 'https://example.com/product2.jpg'
    }
  ]
}
```

**Example:**
```javascript
{
  type: 'products',
  products: [
    {
      name: 'Laptop',
      price: 999.99,
      image: 'https://example.com/laptop.jpg'
    },
    {
      name: 'Mouse',
      price: 29.99,
      image: 'https://example.com/mouse.jpg'
    },
    {
      name: 'Keyboard',
      price: 79.99,
      image: 'https://example.com/keyboard.jpg'
    }
  ]
}
```

---

## 🔗 Complete API Request Example

### Using the SDK API Endpoint

**Endpoint:** `POST /api/v1/sdk/events/replyToEvent`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```javascript
{
  "event": {
    "botId": "my-bot",
    "target": "user-123",
    "channel": "web",
    "threadId": "conversation-456"
  },
  "payloads": [
    {
      "type": "text",
      "text": "Hello! Here's some information:"
    },
    {
      "type": "image",
      "image": "https://example.com/image.jpg",
      "title": "Product Image"
    },
    {
      "type": "products",
      "products": [
        {
          "name": "Product A",
          "price": 99.99,
          "image": "https://example.com/product-a.jpg"
        }
      ]
    }
  ]
}
```

---

## 🎯 JavaScript/Node.js Examples

### Using Axios

```javascript
const axios = require('axios')

async function sendMessage(botId, userId, payload) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/sdk/events/replyToEvent',
      {
        event: {
          botId: botId,
          target: userId,
          channel: 'web',
          threadId: userId  // Usually same as target for web channel
        },
        payloads: [payload]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Message sent successfully')
    return response.data
  } catch (error) {
    console.error('Error sending message:', error.message)
    throw error
  }
}

// Examples:

// Send text
await sendMessage('my-bot', 'user-123', {
  type: 'text',
  text: 'Hello!'
})

// Send image
await sendMessage('my-bot', 'user-123', {
  type: 'image',
  image: 'https://example.com/image.jpg',
  title: 'Check this out'
})

// Send JSON data
await sendMessage('my-bot', 'user-123', {
  type: 'json',
  title: 'Order Details',
  json: {
    orderId: '12345',
    total: 99.99,
    status: 'shipped'
  }
})

// Send products
await sendMessage('my-bot', 'user-123', {
  type: 'products',
  products: [
    { name: 'Item 1', price: 29.99, image: 'url1' },
    { name: 'Item 2', price: 49.99, image: 'url2' }
  ]
})
```

### Send Multiple Messages at Once

```javascript
await axios.post('http://localhost:3000/api/v1/sdk/events/replyToEvent', {
  event: {
    botId: 'my-bot',
    target: 'user-123',
    channel: 'web'
  },
  payloads: [
    { type: 'text', text: 'Here are your options:' },
    { 
      type: 'single-choice',
      text: 'What would you like to do?',
      choices: [
        { title: 'Option 1', value: 'opt1' },
        { title: 'Option 2', value: 'opt2' }
      ]
    }
  ]
})
```

---

## ⚠️ Important Notes

### 1. Clean Your Payloads
Always remove `undefined` values before sending:

```javascript
// ❌ BAD
{
  type: 'text',
  text: 'Hello',
  payload: undefined  // Will cause 400 error
}

// ✅ GOOD
{
  type: 'text',
  text: 'Hello'
}
```

### 2. Required Fields
Each content type has required fields:
- **text**: `text` is required
- **image**: `image` is required
- **video**: `video` is required
- **audio**: `audio` is required
- **json**: Either `json` or `text` is required
- **products**: `products` array is required

### 3. Type Field
Always include the `type` field matching the content type:
```javascript
{ type: 'text', ... }
{ type: 'image', ... }
{ type: 'video', ... }
{ type: 'json', ... }
{ type: 'products', ... }
```

### 4. Media URLs
Media files can be:
- External URLs: `https://example.com/image.jpg`
- Botpress media URLs: `/api/v1/bots/bot-id/media/file-id.jpg`
- Relative paths (will be converted to full URLs)

### 5. Typing Indicators
Add typing indicators to any content type:
```javascript
{
  type: 'text',
  text: 'Hello',
  typing: true  // Shows "typing..." before message
}
```

---

## 🧪 Testing Your Payloads

### Test Script

```javascript
// test-payloads.js
const axios = require('axios')

const BOTPRESS_URL = 'http://localhost:3000'
const BOT_ID = 'your-bot-id'
const USER_ID = 'test-user-123'

async function testPayload(name, payload) {
  console.log(`\n🧪 Testing: ${name}`)
  try {
    await axios.post(`${BOTPRESS_URL}/api/v1/sdk/events/replyToEvent`, {
      event: {
        botId: BOT_ID,
        target: USER_ID,
        channel: 'web'
      },
      payloads: [payload]
    })
    console.log('✅ Success')
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message)
  }
}

// Run tests
(async () => {
  await testPayload('Text', { type: 'text', text: 'Hello!' })
  await testPayload('Image', { type: 'image', image: 'https://picsum.photos/200', title: 'Test' })
  await testPayload('JSON', { type: 'json', title: 'Data', json: { key: 'value' } })
  await testPayload('Products', { 
    type: 'products', 
    products: [{ name: 'Test', price: 99, image: 'https://picsum.photos/100' }] 
  })
})()
```

Run it:
```bash
node test-payloads.js
```

---

## 📚 Additional Resources

- **Botpress v12 Docs:** https://v12.botpress.com/
- **SDK Reference:** https://botpress.com/reference/
- **Content Types Source:** `modules/builtin/src/content-types/`

---

**Last Updated:** 2025-10-16  
**Botpress Version:** v12.31.10
