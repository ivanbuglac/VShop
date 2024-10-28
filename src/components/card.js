export function createProductCard(product, onAddToCart) {
	const productCard = document.createElement('div')
	productCard.className = 'card'
	productCard.setAttribute('data-id', product.id)

	const cardImage = document.createElement('div')
	cardImage.className = 'card__image'
	const image = document.createElement('img')
	image.src = product.thumbnail
	image.alt = product.title
	cardImage.appendChild(image)

	const cardTitle = document.createElement('div')
	cardTitle.className = 'card__title'
	cardTitle.textContent = product.title

	const cardDescription = document.createElement('div')
	cardDescription.className = 'card__description'
	cardDescription.textContent = product.description

	const cardBuy = document.createElement('div')
	cardBuy.className = 'card__buy'

	const priceDiv = document.createElement('div')
	priceDiv.className = 'price'
	priceDiv.textContent = `$${product.price}`

	const priceBtn = document.createElement('div')
	priceBtn.className = 'price-btn'

	const addToCartButton = document.createElement('img')
	addToCartButton.src = './Button.svg'
	addToCartButton.alt = 'Добавить в корзину'
	addToCartButton.className = 'add-to-cart'
	addToCartButton.setAttribute('data-id', product.id)

	addToCartButton.addEventListener('click', () => onAddToCart(product))

	priceBtn.appendChild(addToCartButton)
	cardBuy.appendChild(priceDiv)
	cardBuy.appendChild(priceBtn)

	productCard.appendChild(cardImage)
	productCard.appendChild(cardTitle)
	productCard.appendChild(cardDescription)
	productCard.appendChild(cardBuy)

	return productCard
}
