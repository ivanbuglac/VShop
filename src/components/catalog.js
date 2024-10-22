import { loadProducts } from './api.js'
import { createProductCard } from './card.js'

const catalogRoot = document.getElementById('catalog-root')
let products = []
let productsToShow = 6
let currentOffset = 0

function renderCatalogPart() {
	const productsSubset = products.slice(
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

	if (currentOffset + productsToShow < products.length) {
		let loadMoreBtn = document.querySelector('.btn__show_more')

		if (!loadMoreBtn) {
			loadMoreBtn = document.createElement('button')
			loadMoreBtn.textContent = 'Show More'
			loadMoreBtn.className = 'btn__show_more'
			loadMoreBtn.addEventListener('click', loadMoreProducts)
			catalogRoot.appendChild(loadMoreBtn)
		}
	}
}

function handleAddToCart(product) {
	const addToCartEvent = new CustomEvent('addToCart', {
		detail: { product },
	})
	window.dispatchEvent(addToCartEvent)
}

function loadMoreProducts() {
	currentOffset += productsToShow
	const loadMoreBtn = document.querySelector('.btn__show_more')
	if (loadMoreBtn) loadMoreBtn.remove()

	renderCatalogPart()
}

async function initializeCatalog() {
	products = await loadProducts()
	renderCatalogPart()
}

initializeCatalog()
