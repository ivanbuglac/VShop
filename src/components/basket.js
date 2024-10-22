const cartRoot = document.getElementById('cart-root')
let cart = JSON.parse(localStorage.getItem('cart')) || []

function addToCart(product) {
	const existingProduct = cart.find(item => item.id === product.id)

	if (existingProduct) {
		existingProduct.quantity += 1
	} else {
		cart.push({ ...product, quantity: 1 })
	}

	localStorage.setItem('cart', JSON.stringify(cart))
	renderCart()
}

function renderCart() {
	cartRoot.innerHTML = '<h2>Basket</h2>'

	if (cart.length === 0) {
		cartRoot.innerHTML += '<p>Корзина пуста.</p>'
		return
	}

	const miniCardWrapper = document.createElement('div')
	miniCardWrapper.className = 'basket__mini-card'

	cart.forEach(item => {
		const cartItem = document.createElement('div')
		cartItem.className = 'mini-card'

		cartItem.innerHTML = `
            <div class="mini-card__picture">
                <img src="${item.thumbnail}" alt="${item.title}" />
            </div>
            <div class="product-info">
                <div class="mini-card__title">${item.title}</div>
                <div class="mini-card__price">$${item.price} x ${item.quantity}</div>
            </div>
            <div class="delete">
                <img src="/Vector.svg" alt="Удалить" data-id="${item.id}" class="delete-cart" />
            </div>
        `

		cartItem.querySelector('.delete-cart').addEventListener('click', () => {
			removeFromCart(item.id)
		})

		miniCardWrapper.appendChild(cartItem)
	})

	cartRoot.appendChild(miniCardWrapper)

	const totalPrice = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)
	const totalDiv = document.createElement('div')
	totalDiv.className = 'total'
	totalDiv.innerHTML = `
        <div class="total__price">Total: $${totalPrice.toFixed(2)}</div>
        <div class="total_btn"><button id="checkout-btn">CHECKOUT</button></div>
    `
	cartRoot.appendChild(totalDiv)

	const checkoutBtn = document.getElementById('checkout-btn')
	checkoutBtn.addEventListener('click', clearCart)
}

function clearCart() {
	cart = []
	localStorage.removeItem('cart')
	renderCart()
}

function removeFromCart(id) {
	cart = cart.filter(item => item.id !== id)
	localStorage.setItem('cart', JSON.stringify(cart))
	renderCart()
}

// Слушаем кастомное событие для добавления товара в корзину
window.addEventListener('addToCart', event => {
	addToCart(event.detail.product)
})

renderCart()
