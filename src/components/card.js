export function createProductCard(product, onAddToCart) {
	const productCard = document.createElement('div')
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

	const addToCartButton = productCard.querySelector('.add-to-cart')
	if (addToCartButton) {
		addToCartButton.addEventListener('click', () => onAddToCart(product))
	}

	return productCard
}
