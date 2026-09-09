export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h]
          const escaped = String(val ?? '').replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(',')
    ),
  ]

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function ordersToCSV(orders: any[]) {
  return orders.map((o) => ({
    'Order Number': o.orderNumber,
    'Customer': o.customerInfo?.name || '',
    'Email': o.customerInfo?.email || '',
    'Phone': o.customerInfo?.phone || '',
    'Items': o.items?.length || 0,
    'Subtotal': o.subtotal || 0,
    'Shipping': o.shippingFee || 0,
    'Discount': o.couponDiscount || 0,
    'Total': o.total || 0,
    'Status': o.status || '',
    'Payment': o.paymentMethod || '',
    'Payment Status': o.paymentStatus || '',
    'City': o.shippingAddress?.city || '',
    'Date': new Date(o.createdAt).toLocaleDateString(),
  }))
}

export function productsToCSV(products: any[]) {
  return products.map((p) => ({
    'Name': p.name,
    'SKU': p.sku || '',
    'Price': p.price || 0,
    'Sale Price': p.salePrice || '',
    'Category': p.category?.name || '',
    'Brand': p.brand?.name || '',
    'Stock': p.availableStock || 0,
    'Sold': p.totalSold || 0,
    'Rating': p.averageRating?.toFixed(1) || '0.0',
    'Reviews': p.totalReviews || 0,
    'Featured': p.isFeatured ? 'Yes' : 'No',
    'New Arrival': p.isNewArrival ? 'Yes' : 'No',
    'Best Seller': p.isBestSeller ? 'Yes' : 'No',
  }))
}
