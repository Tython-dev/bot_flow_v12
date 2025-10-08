const base = require('./_base')
const utils = require('./_utils')

function renderElement(data, channel) {
  return utils.extractPayload('products', data)
}

module.exports = {
  id: 'builtin_products',
  group: 'Built-in Messages',
  title: 'Products',

  jsonSchema: {
    description: 'A list of products rendered as cards in Webchat',
    type: 'object',
    required: ['products'],
    properties: {
      products: {
        type: 'array',
        title: 'Products',
        items: {
          type: 'object',
          required: [],
          properties: {
            name: { type: 'string', title: 'Name' },
            price: { anyOf: [{ type: 'number' }, { type: 'string' }], title: 'Price' },
            image: { type: 'string', title: 'Image URL' }
          }
        }
      },
      ...base.typingIndicators
    }
  },

  uiSchema: {
    products: {
      "ui:options": {
        orderable: true
      }
    }
  },

  computePreviewText: formData => {
    const count = (formData && formData.products && formData.products.length) || 0
    const first = formData && formData.products && formData.products[0]
    const label = first && (first.name || first.title || first.image || '')
    return `Products (${count}) ${label}`.trim()
  },

  renderElement
}
