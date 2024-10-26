export async function loadProducts(offset = 0, limit = 6) {
	const BASE_API_URL = 'https://dummyjson.com/products' // URL
	const DEFAULT_OFFSET = 0 // Начальный сдвиг
	const DEFAULT_LIMIT = 6 // Количество товаров на страницу

	try {
		const response = await fetch(
			`${BASE_API_URL}?limit=${limit || DEFAULT_LIMIT}&skip=${
				offset || DEFAULT_OFFSET
			}`
		)
		const data = await response.json()
		return {
			products: data.products,
			total: data.total,
		}
	} catch (error) {
		console.error('Ошибка загрузки каталога:', error)
		return { products: [], total: 0 }
	}
}
