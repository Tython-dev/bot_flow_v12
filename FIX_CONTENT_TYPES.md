# How to Add JSON and Products to Content Type Picker

## Root Cause
Content types are filtered by the bot configuration. If `builtin_json` and `builtin_products` are not listed in your bot's `bot.config.json` file under `imports.contentTypes`, they won't appear in the UI picker.

## Solution: Update Bot Configuration

### Option 1: Manual Update (Recommended)

1. **Locate your bot's config file:**
   ```
   data/bots/<your-bot-id>/bot.config.json
   ```

2. **Open the file and find the `imports` section:**
   ```json
   {
     "imports": {
       "contentTypes": [
         "builtin_text",
         "builtin_image",
         "builtin_video",
         "builtin_audio",
         "builtin_card",
         "builtin_carousel",
         "builtin_single-choice",
         "builtin_file",
         "builtin_location"
       ]
     }
   }
   ```

3. **Add the missing content types:**
   ```json
   {
     "imports": {
       "contentTypes": [
         "builtin_text",
         "builtin_image",
         "builtin_video",
         "builtin_audio",
         "builtin_card",
         "builtin_carousel",
         "builtin_single-choice",
         "builtin_file",
         "builtin_location",
         "builtin_json",        ← ADD THIS
         "builtin_products"     ← ADD THIS
       ]
     }
   }
   ```

4. **Save the file and restart Botpress**

### Option 2: Using Botpress Studio UI

1. Open Botpress Studio
2. Go to **Bot Settings** (gear icon)
3. Navigate to **Imports** section
4. Add `builtin_json` and `builtin_products` to the content types list
5. Save changes

### Option 3: Programmatic Update (For Multiple Bots)

Create a script to update all bots:

```javascript
// update-bot-configs.js
const fs = require('fs')
const path = require('path')

const botsDir = './data/bots'
const newContentTypes = ['builtin_json', 'builtin_products']

// Get all bot directories
const botDirs = fs.readdirSync(botsDir).filter(file => {
  return fs.statSync(path.join(botsDir, file)).isDirectory()
})

botDirs.forEach(botId => {
  const configPath = path.join(botsDir, botId, 'bot.config.json')
  
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    
    // Initialize imports.contentTypes if it doesn't exist
    if (!config.imports) {
      config.imports = {}
    }
    if (!config.imports.contentTypes) {
      config.imports.contentTypes = []
    }
    
    // Add new content types if not already present
    newContentTypes.forEach(type => {
      if (!config.imports.contentTypes.includes(type)) {
        config.imports.contentTypes.push(type)
        console.log(`Added ${type} to bot ${botId}`)
      }
    })
    
    // Save updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  }
})

console.log('Done! Restart Botpress to apply changes.')
```

Run it:
```bash
node update-bot-configs.js
```

## Verification

After updating and restarting:

1. Open Botpress Studio
2. Go to any flow
3. Add a node with "Say something"
4. Click "Pick Content"
5. You should now see **JSON** and **Products** in the list!

## Understanding the Code

### How Content Types Are Loaded

**File:** `packages/bp/src/core/cms/cms-service.ts`

```typescript
async getAllContentTypes(botId?: string): Promise<ContentType[]> {
  if (botId) {
    // When botId is provided, filter by bot config
    const botConfig = await this.configProvider.getBotConfig(botId)
    const enabledTypes = botConfig.imports.contentTypes || []
    return Promise.map(enabledTypes, x => this.getContentType(x))
  }
  
  // Without botId, return all registered content types
  return this.contentTypes
}
```

### Auto-Population for New Bots

**File:** `packages/bp/src/core/bots/bot-service.ts` (lines 559-561)

```typescript
if (!mergedConfigs.imports.contentTypes) {
  const allContentTypes = await this.cms.getAllContentTypes()
  mergedConfigs.imports.contentTypes = allContentTypes.map(x => x.id)
}
```

This means:
- **New bots** automatically get ALL content types
- **Existing bots** only have the content types that were available when they were created
- **Solution**: Manually add new content types to existing bots

## All Available Built-in Content Types

Here's the complete list of built-in content types you can add:

```json
[
  "builtin_text",
  "builtin_image",
  "builtin_video",
  "builtin_audio",
  "builtin_card",
  "builtin_carousel",
  "builtin_single-choice",
  "builtin_file",
  "builtin_location",
  "builtin_json",
  "builtin_products",
  "dropdown"
]
```

## Bot Template Files

If you want new bots to include JSON and Products by default, update the bot templates:

**Files to update:**
- `modules/builtin/src/bot-templates/welcome-bot/bot.config.json`
- `modules/builtin/src/bot-templates/empty-bot/bot.config.json`
- `modules/builtin/src/bot-templates/small-talk/bot.config.json`
- `modules/builtin/src/bot-templates/learn-botpress/bot.config.json`

Add to each template's `bot.config.json`:
```json
{
  "imports": {
    "contentTypes": [
      "builtin_text",
      "builtin_image",
      "builtin_video",
      "builtin_audio",
      "builtin_card",
      "builtin_carousel",
      "builtin_single-choice",
      "builtin_file",
      "builtin_location",
      "builtin_json",
      "builtin_products"
    ]
  }
}
```

## Troubleshooting

### Content types still not showing?

1. **Clear browser cache:** Ctrl+Shift+Delete
2. **Restart Botpress server completely**
3. **Check bot config was saved:** Open `data/bots/<bot-id>/bot.config.json` and verify changes
4. **Check Botpress logs:** Look for "Loaded X content types" message
5. **Verify content type files exist:**
   - `modules/builtin/src/content-types/json.js`
   - `modules/builtin/src/content-types/products.js`

### Error: "Content type not found"

If you get this error after adding to config:
1. Make sure you spelled the ID correctly: `builtin_json` (not `json`)
2. Rebuild the project: `yarn build`
3. Restart Botpress

### Content types work in API but not in UI?

This confirms the issue is with the bot config filter. Follow Option 1 above.

## Summary

✅ **JSON and Products content types exist and are properly configured**  
✅ **They are loaded by Botpress on startup**  
❌ **They are filtered out by bot configuration**  
✅ **Solution: Add them to `imports.contentTypes` in bot config**

After this fix, both JSON and Products will appear in the content picker UI!
