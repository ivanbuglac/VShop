import { loadProducts } from './api.js'
import { createProductCard } from './card.js'
import { updateFilterOptions, filteredCatalog } from './filter.js'

const catalogRoot = document.getElementById('catalog-root')
const INITIAL_OFFSET = 0
const PRODUCTS_PER_PAGE = 6
let currentOffset = INITIAL_OFFSET
let totalProducts = 0
let loadMoreBtn = null

async function renderCatalogPart(productsSubset = null) {
	let productsToRender
	if (productsSubset) {
		productsToRender = productsSubset
	} else {
		const { products, total } = await loadProducts(
			currentOffset,
			PRODUCTS_PER_PAGE
		)
		productsToRender = products
		totalProducts = total
	}

	productsToRender.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})

	if (!productsSubset) {
		updateFilterOptions(productsToRender)
	}
	checkShowMoreButton()
}

function checkShowMoreButton() {
	if (currentOffset + PRODUCTS_PER_PAGE < totalProducts) {
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
	currentOffset += PRODUCTS_PER_PAGE
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

window.addEventListener('filteredProducts', event => {
	const filteredProducts = event.detail.filteredProducts
	catalogRoot.innerHTML = ''
	currentOffset = INITIAL_OFFSET

	filteredProducts.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})

	console.log('Отфильтрованные продукты:', filteredCatalog)
})

window.addEventListener('resetFilters', () => {
	catalogRoot.innerHTML = ''
	currentOffset = INITIAL_OFFSET
	totalProducts = 0
	initializeCatalog()
	checkShowMoreButton()
})

async function initializeCatalog() {
	await renderCatalogPart()
}

initializeCatalog()
