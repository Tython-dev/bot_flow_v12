const base = require('./_base')
const utils = require('./_utils')

function renderElement(data, channel) {
  // accept json, data or text (preformatted)
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

module.exports = {
  id: 'builtin_json',
  group: 'Built-in Messages',
  title: 'JSON',

  jsonSchema: {
    description: 'Render JSON payload in Webchat',
    type: 'object',
    required: [],
    properties: {
      title: { type: 'string', title: 'Title' },
      json: { type: 'object', title: 'JSON' },
      data: { type: 'object', title: 'Data (alias)' },
      text: { type: 'string', title: 'Preformatted text' },
      ...base.typingIndicators
    }
  },

  uiSchema: {
    json: {
      'ui:widget': 'json'
    },
    data: {
      'ui:widget': 'json'
    },
    text: {
      'ui:widget': 'textarea'
    }
  },

  computePreviewText: formData => {
    const title = (formData && formData.title) || 'JSON'
    return `${title}`
  },

  renderElement
}
