// main.js (или любой другой основной файл)

import { createProductCard } from './card.js'
import { loadProducts } from './api.js' // Импортируем функцию для загрузки товаров

const catalogRoot = document.getElementById('catalog-root')
let currentOffset = 0 // Смещение для загрузки следующей порции товаров
const productsToShow = 6 // Сколько товаров показывать за один раз
let totalProducts = 0 // Общее количество товаров на сервере

// Функция для отрисовки части каталога
async function renderCatalogPart() {
	// Загружаем товары с API
	const { products: productsSubset, total } = await loadProducts(
		currentOffset,
		productsToShow
	)
	totalProducts = total // Обновляем общее количество товаров

	// Рендерим каждую карточку
	productsSubset.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})

	// Показываем или скрываем кнопку "Show More" в зависимости от загруженных товаров
	const loadMoreBtn = document.querySelector('.btn__show_more')

	if (currentOffset + productsToShow < totalProducts) {
		if (!loadMoreBtn) {
			const newLoadMoreBtn = document.createElement('button')
			newLoadMoreBtn.textContent = 'Show More'
			newLoadMoreBtn.className = 'btn__show_more'
			newLoadMoreBtn.addEventListener('click', loadMoreProducts)
			catalogRoot.appendChild(newLoadMoreBtn)
		}
	} else if (loadMoreBtn) {
		loadMoreBtn.remove()
	}
}

// Обработчик добавления товара в корзину
function handleAddToCart(product) {
	const addToCartEvent = new CustomEvent('addToCart', {
		detail: { product },
	})
	window.dispatchEvent(addToCartEvent)
}

// Функция для подгрузки товаров при нажатии на кнопку "Show More"
function loadMoreProducts() {
	currentOffset += productsToShow // Увеличиваем смещение
	renderCatalogPart() // Подгружаем следующую партию товаров
}

// Инициализация каталога
async function initializeCatalog() {
	await renderCatalogPart() // Загружаем первую порцию товаров
}

initializeCatalog()
