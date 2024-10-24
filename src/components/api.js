export async function loadProducts() {
	const limit = 30 // количество товаров, загружаемых за один запрос
	let products = [] // массив для всех товаров
	let total = 192 // общее количество товаров (вы можете изменить это число, если оно будет другим)
	let skip = 0 // начальная позиция для пропуска

	try {
		while (skip < total) {
			const response = await fetch(
				`https://dummyjson.com/products?limit=${limit}&skip=${skip}`
			)
			const data = await response.json()
			products = [...products, ...data.products] // добавляем новые товары к массиву
			skip += limit // увеличиваем значение skip для следующего запроса
		}
		return products
	} catch (error) {
		console.error('Ошибка загрузки каталога:', error)
		return []
	}
}
