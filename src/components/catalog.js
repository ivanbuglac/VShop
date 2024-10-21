import { loadProducts } from './api.js'

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
			productCard = document.createElement('div')
			productCard.className = 'card'
			productCard.setAttribute('data-id', product.id)

			productCard.innerHTML = `
				<div class="card__image">
					<img src="${product.thumbnail}" alt="${product.title}" />
				</div>
				<div class="card__title">${product.title}</div>
				<div class="card__description">${product.description}</div>
				<div class="card__buy">
					<div class="price">$${product.price}</div>
					<div class="price-btn">
						<img src="/Button.svg" alt="Добавить в корзину" data-id="${product.id}" class="add-to-cart" />
					</div>
				</div>
			`

			productCard
				.querySelector('.add-to-cart')
				.addEventListener('click', () => {
					const addToCartEvent = new CustomEvent('addToCart', {
						detail: { product },
					})
					window.dispatchEvent(addToCartEvent)
				})

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
