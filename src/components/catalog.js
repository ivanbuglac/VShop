import { loadProducts } from './api.js'
import { createProductCard } from './card.js'

const catalogRoot = document.getElementById('catalog-root')
let products = []
let filteredProducts = [] // Для хранения отфильтрованных товаров
let productsToShow = 6
let currentOffset = 0

function renderCatalogPart(productList) {
	const productsSubset = productList.slice(
		currentOffset,
		currentOffset + productsToShow
	)

	productsSubset.forEach(product => {
		let productCard = document.querySelector(`.card[data-id="${product.id}"]`)

		if (!productCard) {
			productCard = createProductCard(product, handleAddToCart)
			catalogRoot.appendChild(productCard)
		} else {
			const priceElement = productCard.querySelector('.price')
			if (priceElement) {
				priceElement.textContent = `$${product.price}`
			}
		}
	})

	if (currentOffset + productsToShow < productList.length) {
		let loadMoreBtn = document.querySelector('.btn__show_more')

		if (!loadMoreBtn) {
			loadMoreBtn = document.createElement('button')
			loadMoreBtn.textContent = 'Show More'
			loadMoreBtn.className = 'btn__show_more'
			loadMoreBtn.addEventListener('click', () => loadMoreProducts(productList))
			catalogRoot.appendChild(loadMoreBtn)
		}
	} else {
		const loadMoreBtn = document.querySelector('.btn__show_more')
		if (loadMoreBtn) loadMoreBtn.remove() // Удаляем кнопку, если товаров больше нет
	}
}

function handleAddToCart(product) {
	const addToCartEvent = new CustomEvent('addToCart', {
		detail: { product },
	})
	window.dispatchEvent(addToCartEvent)
}

function loadMoreProducts(productList) {
	currentOffset += productsToShow
	const loadMoreBtn = document.querySelector('.btn__show_more')
	if (loadMoreBtn) loadMoreBtn.remove()

	renderCatalogPart(productList)
}

async function initializeCatalog() {
	products = await loadProducts()
	filteredProducts = [...products] // Изначально отображаем все товары
	renderCatalogPart(filteredProducts)
}

// Обрабатываем событие фильтрации товаров
window.addEventListener('filteredProducts', event => {
	filteredProducts = event.detail.filteredProducts
	currentOffset = 0 // Сбрасываем смещение при фильтрации
	catalogRoot.innerHTML = '' // Очищаем каталог перед фильтрацией
	renderCatalogPart(filteredProducts)
})

// Инициализируем каталог при загрузке страницы
initializeCatalog()
