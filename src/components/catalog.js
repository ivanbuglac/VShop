import { loadProducts } from './api.js'
import { createProductCard } from './card.js'

const catalogRoot = document.getElementById('catalog-root')
let currentOffset = 0
const productsToShow = 6
let totalProducts = 0
let loadMoreBtn = null
let allProducts = [] // Храним все продукты для фильтрации

async function renderCatalogPart() {
	const { products: productsSubset, total } = await loadProducts(
		currentOffset,
		productsToShow
	)

	if (totalProducts === 0) {
		totalProducts = total
	}

	console.log('Current Offset:', currentOffset)
	console.log('Products to Show:', productsToShow)
	console.log('Total Products:', totalProducts)

	allProducts = [...allProducts, ...productsSubset]

	productsSubset.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})

	checkShowMoreButton()
}

function checkShowMoreButton() {
	if (currentOffset + productsToShow < totalProducts) {
		if (!loadMoreBtn) {
			loadMoreBtn = document.createElement('button')
			loadMoreBtn.textContent = 'Show More'
			loadMoreBtn.className = 'btn__show_more'
			loadMoreBtn.addEventListener('click', loadMoreProducts)
			catalogRoot.appendChild(loadMoreBtn)
		}
	} else if (loadMoreBtn) {
		loadMoreBtn.remove()
		loadMoreBtn = null
	}
}

function loadMoreProducts() {
	currentOffset += productsToShow

	if (loadMoreBtn) {
		loadMoreBtn.remove()
		loadMoreBtn = null
	}

	renderCatalogPart()
}

function handleAddToCart(product) {
	const addToCartEvent = new CustomEvent('addToCart', {
		detail: { product },
	})
	window.dispatchEvent(addToCartEvent)
}

function displayFilteredProducts(event) {
	catalogRoot.innerHTML = ''

	const { filteredProducts } = event.detail

	filteredProducts.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})
}

window.addEventListener('filteredProducts', displayFilteredProducts)

async function initializeCatalog() {
	await renderCatalogPart()
}

initializeCatalog()
