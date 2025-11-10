# Botpress v12 Payload Structure & Error Analysis

## Overview
This document explains how Botpress v12 manages message payloads and common errors.

## Payload Flow Architecture

### 1. Content Type Definition (`modules/builtin/src/content-types/`)
Each content type (json.js, products.js, text.js, etc.) defines:
- `id`: Unique identifier (e.g., 'builtin_json')
- `group`: Category for UI picker (e.g., 'Built-in Messages')
- `title`: Display name
- `renderElement(data, channel)`: Function that creates the payload

**Example from json.js:**
```javascript
function renderElement(data, channel) {
  const { json, data, text, title, ...rest } = data || {}
  const payload = {
    type: 'json',
    title,
    json: typeof json !== 'undefined' ? json : typeof data !== 'undefined' ? data : undefined,
    text,
    ...rest
  }
  return utils.extractPayload('json', payload)
}
```

### 2. Payload Extraction (`_utils.js`)
The `extractPayload()` function cleans the payload:
```javascript
function extractPayload(type, data) {
  const payload = {
    type,
    ...data
  }
  
  // Remove internal Botpress fields
  delete payload.event
  delete payload.temp
  delete payload.user
  delete payload.session
  delete payload.bot
  delete payload.BOT_URL
  
  return payload
}
```

### 3. Event Engine (`packages/bp/src/core/events/event-engine.ts`)
The `replyToEvent()` method creates outgoing events:
```typescript
async replyToEvent(
  eventDestination: sdk.IO.EventDestination,
  payloads: any[],
  incomingEventId?: string
): Promise<void> {
  for (const payload of payloads) {
    const replyEvent = Event({
      ..._.pick(eventDestination, ['botId', 'channel', 'target', 'threadId']),
      direction: 'outgoing',
      type: payload.type ?? 'text',
      payload,  // The entire payload object
      incomingEventId
    })
    
    await this.sendEvent(replyEvent)
  }
}
```

### 4. Messaging Middleware (`packages/bp/src/core/messaging/subservices/middleware.ts`)
Before sending to external messaging:
- Fixes URLs in payloads
- Calls `messaging.client.createMessage()` with the payload

## Current Payload Issue

### Problem
Your payload structure has a nested `payload` field:
```javascript
{
  text: 'hi',
  payload: undefined  // ❌ This causes issues
}
```

### Why This Causes 400 Errors

1. **Undefined values**: The messaging client may reject payloads with `undefined` values
2. **Nested payload confusion**: Having a `payload` field inside a payload object is confusing
3. **Validation failure**: The messaging API expects clean, well-defined payload structures

## Solutions

### Solution 1: Remove the nested `payload` field
The cleanest solution is to not include a `payload` field in your payload:

```javascript
// ❌ BAD
{
  text: 'hi',
  payload: undefined
}

// ✅ GOOD
{
  text: 'hi'
}
```

### Solution 2: If you need additional data, use a different field name
```javascript
{
  text: 'hi',
  metadata: { /* your data */ },
  customData: { /* your data */ }
}
```

### Solution 3: Update extractPayload to remove undefined values
Modify `modules/builtin/src/content-types/_utils.js`:

```javascript
function extractPayload(type, data) {
  const payload = {
    type,
    ...data
  }
  
  // Remove internal Botpress fields
  delete payload.event
  delete payload.temp
  delete payload.user
  delete payload.session
  delete payload.bot
  delete payload.BOT_URL
  
  // NEW: Remove undefined values
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) {
      delete payload[key]
    }
  })
  
  return payload
}
```

## Common 400 Error Scenarios

### 1. Empty or Missing Payloads Array
```javascript
// ❌ This will cause 400
await api.events.replyToEvent(event, [])

// ✅ Must have at least one payload
await api.events.replyToEvent(event, [{ type: 'text', text: 'Hello' }])
```

### 2. Invalid Payload Structure
```javascript
// ❌ Payload must be an object
await api.events.replyToEvent(event, ['string'])

// ✅ Payload must be an object with at least 'type'
await api.events.replyToEvent(event, [{ type: 'text', text: 'Hello' }])
```

### 3. Missing Required Fields
The event schema requires:
- `type`: string (required)
- `channel`: string (required)
- `target`: string (required)
- `payload`: object (required)
- `botId`: string (required)

## Debugging 400 Errors

### Enable Debug Logging
Set environment variable:
```bash
BP_DEBUG_IO=true
```

### Check the Payload Before Sending
Add logging in your code:
```javascript
console.log('Sending payload:', JSON.stringify(payload, null, 2))
await sendMsgTOBotpress(payload)
```

### Validate Payload Structure
Before sending, ensure:
1. No `undefined` values
2. All required fields present
3. Payload is a proper object
4. No circular references

## Content Type Registration

Content types are automatically loaded from `modules/builtin/src/content-types/`:
- Files starting with `_` are excluded (utilities)
- Each file exports a module with `id`, `group`, `title`, etc.
- CMS Service loads them on startup via `_loadContentTypesFromFiles()`

### Why JSON and Products Might Not Appear in UI

1. **Build not updated**: Run `yarn build` to compile changes
2. **Module not loaded**: Check that builtin module is enabled
3. **Cache issue**: Clear browser cache and restart Botpress
4. **Group filtering**: UI might filter by group name

### To Verify Content Types Are Loaded
Check Botpress logs on startup:
```
Loaded X content types
```

## API Endpoint for Sending Messages

The SDK API endpoint is:
```
POST /api/v1/sdk/events/replyToEvent
```

**Request Body:**
```json
{
  "event": {
    "botId": "your-bot-id",
    "target": "user-id",
    "channel": "web",
    "threadId": "conversation-id"
  },
  "payloads": [
    {
      "type": "text",
      "text": "Hello!"
    }
  ]
}
```

**Validation (from validation.ts):**
- `event` object is required with botId, target, channel
- Either `contentId` OR `payloads` must be set
- `payloads` must be an array of objects

## Next Steps

1. **Fix your payload structure** - Remove the nested `payload: undefined` field
2. **Update _utils.js** - Add undefined value removal (optional but recommended)
3. **Rebuild the project** - Run `yarn build` to ensure JSON and Products appear in UI
4. **Test with proper payloads** - Use the correct structure shown above
5. **Enable debug logging** - Set `BP_DEBUG_IO=true` to see payload flow
