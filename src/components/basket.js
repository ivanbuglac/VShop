const EMPTY_CART_TEXT = 'Корзина пуста.'
const CHECKOUT_TEXT = 'CHECKOUT'
const TOTAL_TEXT = 'Total'
const DELETE_ICON_PATH = './public/Vector.svg'

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
		cartRoot.innerHTML += `<p>${EMPTY_CART_TEXT}</p>`
		return
	}

	const miniCardWrapper = document.createElement('div')
	miniCardWrapper.className = 'basket__mini-card'

	cart.forEach(item => {
		const cartItem = document.createElement('div')
		cartItem.className = 'mini-card'

		const miniCardPicture = document.createElement('div')
		miniCardPicture.className = 'mini-card__picture'
		const img = document.createElement('img')
		img.src = item.thumbnail
		img.alt = item.title
		miniCardPicture.appendChild(img)

		const productInfo = document.createElement('div')
		productInfo.className = 'product-info'
		const miniCardTitle = document.createElement('div')
		miniCardTitle.className = 'mini-card__title'
		miniCardTitle.textContent = item.title
		const miniCardPrice = document.createElement('div')
		miniCardPrice.className = 'mini-card__price'
		miniCardPrice.textContent = `$${item.price} x ${item.quantity}`
		productInfo.appendChild(miniCardTitle)
		productInfo.appendChild(miniCardPrice)

		const deleteWrapper = document.createElement('div')
		deleteWrapper.className = 'delete'
		const deleteImg = document.createElement('img')
		deleteImg.src = DELETE_ICON_PATH
		deleteImg.alt = 'Удалить'
		deleteImg.addEventListener('click', () => {
			removeFromCart(item.id)
		})
		deleteWrapper.appendChild(deleteImg)

		cartItem.appendChild(miniCardPicture)
		cartItem.appendChild(productInfo)
		cartItem.appendChild(deleteWrapper)

		miniCardWrapper.appendChild(cartItem)
	})

	cartRoot.appendChild(miniCardWrapper)

	const totalPrice = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)
	const totalDiv = document.createElement('div')
	totalDiv.className = 'total'

	const totalPriceDiv = document.createElement('div')
	totalPriceDiv.className = 'total__price'
	totalPriceDiv.textContent = `${TOTAL_TEXT}: $${totalPrice.toFixed(2)}`

	const checkoutBtnWrapper = document.createElement('div')
	checkoutBtnWrapper.className = 'total_btn'
	const checkoutBtn = document.createElement('button')
	checkoutBtn.id = 'checkout-btn'
	checkoutBtn.textContent = CHECKOUT_TEXT
	checkoutBtn.addEventListener('click', clearCart)

	checkoutBtnWrapper.appendChild(checkoutBtn)
	totalDiv.appendChild(totalPriceDiv)
	totalDiv.appendChild(checkoutBtnWrapper)

	cartRoot.appendChild(totalDiv)
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

window.addEventListener('addToCart', event => {
	addToCart(event.detail.product)
})

renderCart()
