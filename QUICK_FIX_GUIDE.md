# Quick Fix Guide for Payload Issues

## Problem Summary
You're experiencing a 400 error when sending messages to Botpress with this payload structure:
```javascript
{
  text: 'hi',
  payload: undefined  // ❌ This causes the 400 error
}
```

## ✅ Solution Applied

I've updated `modules/builtin/src/content-types/_utils.js` to automatically remove `undefined` values from payloads. This prevents the 400 error.

## What Changed

**File: `modules/builtin/src/content-types/_utils.js`**

Added code to remove undefined values:
```javascript
// Remove undefined values to prevent 400 errors
Object.keys(payload).forEach(key => {
  if (payload[key] === undefined) {
    delete payload[key]
  }
})
```

## Next Steps

### 1. Rebuild the Project
```bash
cd c:\Users\brahi\ProjectsTython\bot_flow_v12
yarn build
```

### 2. Restart Botpress
After building, restart your Botpress server to load the changes.

### 3. Test Your Payload
Your payload will now work correctly:
```javascript
// Before fix: { text: 'hi', payload: undefined }
// After fix:  { text: 'hi' }  // undefined field removed automatically
```

## For Your External Application

In your external app (`/app/src/controllers/meta/metaApi.js`), you should also clean your payloads before sending:

### Option 1: Remove undefined fields before sending
```javascript
// Clean the payload before sending
function cleanPayload(payload) {
  const cleaned = { ...payload }
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key]
    }
  })
  return cleaned
}

// Use it:
const payload = { text: 'hi', payload: undefined }
const cleanedPayload = cleanPayload(payload)
await sendMsgTOBotpress(cleanedPayload)
```

### Option 2: Don't include undefined fields
```javascript
// ✅ Best practice: Only include defined values
const payload = {
  type: 'text',
  text: 'hi'
  // Don't include payload field if it's undefined
}
```

## Understanding the 400 Error

The error occurs because:
1. Botpress messaging API validates payload structure
2. `undefined` values in JSON become `null` or cause validation errors
3. The nested `payload` field with `undefined` value is invalid

## Proper Payload Structure

### Text Message
```javascript
{
  type: 'text',
  text: 'Hello world'
}
```

### JSON Content Type
```javascript
{
  type: 'json',
  title: 'Data',
  json: { key: 'value' }
}
```

### Products Content Type
```javascript
{
  type: 'products',
  products: [
    {
      name: 'Product 1',
      price: 99.99,
      image: 'https://example.com/image.jpg'
    }
  ]
}
```

## Checking if JSON and Products Appear in UI

After rebuilding, verify content types are loaded:

1. Check Botpress logs for: `Loaded X content types`
2. Open Botpress Studio
3. Create a new node with "Say something"
4. Click "Pick Content"
5. You should see "JSON" and "Products" in the list

If they don't appear:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart Botpress server
- Check that builtin module is enabled in bot configuration

## Debugging Tips

### Enable Debug Mode
```bash
# Windows PowerShell
$env:BP_DEBUG_IO="true"
yarn start

# Or in your .env file
BP_DEBUG_IO=true
```

### Log Payloads Before Sending
In your external app:
```javascript
console.log('Payload before sending:', JSON.stringify(payload, null, 2))
await sendMsgTOBotpress(payload)
```

### Check Botpress Logs
Look for validation errors in Botpress console output.

## Common Mistakes to Avoid

❌ **Don't do this:**
```javascript
{
  text: 'hi',
  payload: undefined,
  data: null,
  options: undefined
}
```

✅ **Do this instead:**
```javascript
{
  text: 'hi'
  // Only include fields with actual values
}
```

## API Endpoint Reference

**Endpoint:** `POST /api/v1/sdk/events/replyToEvent`

**Required Fields:**
- `event.botId` (string)
- `event.target` (string) - User ID
- `event.channel` (string) - e.g., 'web', 'telegram'
- `payloads` (array) - Array of payload objects

**Example Request:**
```json
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
      "text": "Hello!"
    }
  ]
}
```

## Need More Help?

- See `PAYLOAD_ANALYSIS.md` for detailed architecture
- Check Botpress v12 docs: https://v12.botpress.com/
- Review the SDK reference: https://botpress.com/reference/
