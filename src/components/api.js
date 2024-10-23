export async function loadProducts() {
	try {
		const response = await fetch('https://dummyjson.com/products?limit=30')
		const data = await response.json()
		return data.products
	} catch (error) {
		console.error('Ошибка загрузки каталога:', error)
		return []
	}
}
