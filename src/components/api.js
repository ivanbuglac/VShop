export async function loadProducts(offset = 0, limit = 6) {
	try {
		const response = await fetch(
			`https://dummyjson.com/products?limit=${limit}&skip=${offset}`
		)
		const data = await response.json()
		return {
			products: data.products,
			total: data.total, // Общее количество товаров на сервере
		}
	} catch (error) {
		console.error('Ошибка загрузки каталога:', error)
		return { products: [], total: 0 }
	}
}
