import React from 'react'

import { Renderer } from '../../../typings'

const stringify = (value: unknown): string => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return JSON.stringify(parsed, null, 2)
    } catch (err) {
      return value
    }
  }

  if (typeof value === 'undefined') {
    return ''
  }

  try {
    return JSON.stringify(value, null, 2)
  } catch (err) {
    return '/* Unable to display JSON payload */'
  }
}

export const Json = (props: Renderer.Json) => {
  const { className, title, text } = props
  const raw = props.json ?? props.data ?? null
  const content = text || stringify(raw)

  if (!content) {
    return null
  }

  return (
    <div className={`bpw-json ${className || ''}`.trim()}>
      {title && <div className="bpw-json-title">{title}</div>}
      <pre className="bpw-json-block">{content}</pre>
      <style>{`
        .bpw-json {
          width: 100%;
        }

        .bpw-json-title {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .bpw-json-block {
          background: #1f2937;
          color: #e5e7eb;
          border-radius: 6px;
          padding: 10px 12px;
          overflow: auto;
          font-size: 0.85rem;
          line-height: 1.4;
        }
      `}</style>
    </div>
  )
}

export default Json
