/**
 * Script to add builtin_json and builtin_products to all bot configurations
 * 
 * Usage: node update-bot-content-types.js
 */

const fs = require('fs')
const path = require('path')

const botsDir = path.join(__dirname, 'data', 'bots')
const newContentTypes = ['builtin_json', 'builtin_products']

console.log('🔍 Searching for bot configurations...\n')

// Check if bots directory exists
if (!fs.existsSync(botsDir)) {
  console.error(`❌ Bots directory not found: ${botsDir}`)
  console.log('Make sure you run this script from the Botpress root directory.')
  process.exit(1)
}

// Get all bot directories
const botDirs = fs.readdirSync(botsDir).filter(file => {
  const fullPath = path.join(botsDir, file)
  return fs.statSync(fullPath).isDirectory()
})

if (botDirs.length === 0) {
  console.log('⚠️  No bots found in data/bots/')
  process.exit(0)
}

console.log(`Found ${botDirs.length} bot(s):\n`)

let updatedCount = 0
let errorCount = 0

botDirs.forEach(botId => {
  const configPath = path.join(botsDir, botId, 'bot.config.json')
  
  console.log(`📦 Processing bot: ${botId}`)
  
  if (!fs.existsSync(configPath)) {
    console.log(`   ⚠️  Config file not found, skipping...\n`)
    return
  }
  
  try {
    // Read current config
    const configContent = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(configContent)
    
    // Initialize imports.contentTypes if it doesn't exist
    if (!config.imports) {
      config.imports = {}
    }
    if (!config.imports.contentTypes) {
      config.imports.contentTypes = []
    }
    
    // Track what was added
    const added = []
    
    // Add new content types if not already present
    newContentTypes.forEach(type => {
      if (!config.imports.contentTypes.includes(type)) {
        config.imports.contentTypes.push(type)
        added.push(type)
      }
    })
    
    if (added.length > 0) {
      // Create backup
      const backupPath = configPath + '.backup'
      fs.writeFileSync(backupPath, configContent)
      
      // Save updated config
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      
      console.log(`   ✅ Added: ${added.join(', ')}`)
      console.log(`   💾 Backup saved to: bot.config.json.backup\n`)
      updatedCount++
    } else {
      console.log(`   ℹ️  Already has all content types\n`)
    }
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`)
    errorCount++
  }
})

// Summary
console.log('─'.repeat(50))
console.log(`\n📊 Summary:`)
console.log(`   Total bots: ${botDirs.length}`)
console.log(`   Updated: ${updatedCount}`)
console.log(`   Errors: ${errorCount}`)
console.log(`   No changes needed: ${botDirs.length - updatedCount - errorCount}`)

if (updatedCount > 0) {
  console.log('\n✨ Done! Next steps:')
  console.log('   1. Restart Botpress server')
  console.log('   2. Open Botpress Studio')
  console.log('   3. Go to any flow and click "Pick Content"')
  console.log('   4. You should now see JSON and Products in the list!')
} else {
  console.log('\n✨ All bots already have the required content types!')
}

console.log('\n💡 Tip: Backup files (.backup) have been created. You can restore them if needed.')
