import { loadProducts } from './api.js'
import { createProductCard } from './card.js'
import { updateFilterOptions } from './filter.js'

const catalogRoot = document.getElementById('catalog-root')
const INITIAL_OFFSET = 0
const PRODUCTS_PER_PAGE = 6
let currentOffset = INITIAL_OFFSET
let totalProducts = 0
let loadMoreBtn = null

async function renderCatalogPart() {
	const { products: productsSubset, total } = await loadProducts(
		currentOffset,
		PRODUCTS_PER_PAGE
	)

	if (totalProducts === 0) {
		totalProducts = total
	}

	productsSubset.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})

	updateFilterOptions(productsSubset)

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
	filteredProducts.forEach(product => {
		const productCard = createProductCard(product, handleAddToCart)
		catalogRoot.appendChild(productCard)
	})

	if (filteredProducts.length >= PRODUCTS_PER_PAGE) {
		checkShowMoreButton()
	} else if (loadMoreBtn) {
		loadMoreBtn.remove()
		loadMoreBtn = null
	}
})

async function initializeCatalog() {
	await renderCatalogPart()
}

initializeCatalog()
