import React from 'react'

/**
 * Simple product cards grid renderer
 * Expects payload:
 * {
 *   type: 'products',
 *   products: [{ name, price, image }]
 * }
 */
type ProductItem = {
  name?: string
  price?: number | string
  image?: string
}

type ProductsProps = {
  products?: ProductItem[]
  className?: string
}

const formatPrice = (price: ProductItem['price']) => {
  if (price === null || typeof price === 'undefined') {
    return null
  }

  if (typeof price === 'number') {
    const formatted = price.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    return `$${formatted}`
  }

  return price
}

export const Products = (props: ProductsProps) => {
  const { products = [], className } = props

  if (!Array.isArray(products) || products.length === 0) {
    return null
  }

  return (
    <div className={`bpw-products ${className || ''}`.trim()}>
      <div className="bpw-products-grid">
        {products.map((p, idx) => {
          const priceLabel = formatPrice(p.price)
          return (
            <div key={idx} className="bpw-product-card">
              {p.image && (
                <div className="bpw-product-image-wrapper">
                  <img className="bpw-product-image" src={p.image} alt={p.name || 'product'} />
                </div>
              )}
              <div className="bpw-product-content">
                {p.name && <div className="bpw-product-name">{p.name}</div>}
                {priceLabel && <div className="bpw-product-price">{priceLabel}</div>}
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        .bpw-products { width: 100%; }
        .bpw-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        .bpw-product-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        .bpw-product-image-wrapper { width: 100%; background: #f9fafb; }
        .bpw-product-image { width: 100%; height: 120px; object-fit: cover; display:block; }
        .bpw-product-content { padding: 8px 10px; }
        .bpw-product-name { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }
        .bpw-product-price { color: #111827; font-size: 0.9rem; }
      `}</style>
    </div>
  )
}

export default Products
