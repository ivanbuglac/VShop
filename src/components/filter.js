import { loadProducts } from './api.js'

const filterModal = document.getElementById('filter-modal')
const filterBtn = document.getElementById('filter-btn')
const closeModal = document.getElementById('close-modal')

const filtersRoot = document.getElementById('filters-root')

let allProducts = []
let selectedFilters = {
	tags: new Set(),
	brands: new Set(),
}

filterBtn.addEventListener('click', () => {
	filterModal.style.display = 'block'
})

closeModal.addEventListener('click', () => {
	filterModal.style.display = 'none'
})

window.addEventListener('click', event => {
	if (event.target === filterModal) {
		filterModal.style.display = 'none'
	}
})

function createFilterGroup(title, items, filterType) {
	const filterGroup = document.createElement('div')
	filterGroup.className = 'filter-group'

	const groupTitle = document.createElement('h3')
	groupTitle.textContent = title
	filterGroup.appendChild(groupTitle)

	items.forEach(item => {
		const filterItem = document.createElement('div')
		filterItem.className = 'filter-item'

		const label = document.createElement('span') //  span для метки
		label.textContent = item
		label.className = 'filter-label' // Добавляем класс для метки
		label.addEventListener('click', () => handleFilterChange(filterType, item))

		filterItem.appendChild(label)
		filterGroup.appendChild(filterItem)
	})

	return filterGroup
}

function handleFilterChange(filterType, value) {
	if (filterType === 'tags') {
		if (selectedFilters.tags.has(value)) {
			selectedFilters.tags.delete(value)
		} else {
			selectedFilters.tags.add(value)
		}
	} else if (filterType === 'brands') {
		if (selectedFilters.brands.has(value)) {
			selectedFilters.brands.delete(value)
		} else {
			selectedFilters.brands.add(value)
		}
	}

	updateFilterLabels(filterType, value)

	filterProducts()
}

function updateFilterLabels(filterType, value) {
	const labels = document.querySelectorAll(`.filter-label`)
	labels.forEach(label => {
		if (label.textContent === value) {
			if (filterType === 'tags' && selectedFilters.tags.has(value)) {
				label.classList.add('active')
			} else if (filterType === 'brands' && selectedFilters.brands.has(value)) {
				label.classList.add('active')
			} else {
				label.classList.remove('active')
			}
		}
	})
}

function filterProducts() {
	const filteredProducts = allProducts.filter(product => {
		const matchesTags =
			selectedFilters.tags.size === 0 ||
			[...selectedFilters.tags].some(tag => product.tags.includes(tag))
		const matchesBrand =
			selectedFilters.brands.size === 0 ||
			selectedFilters.brands.has(product.brand)

		return matchesTags && matchesBrand
	})

	const filterEvent = new CustomEvent('filteredProducts', {
		detail: { filteredProducts },
	})
	window.dispatchEvent(filterEvent)
}

async function initializeFilters() {
	const { products } = await loadProducts(0, 194) // Загружаем все товары

	allProducts = products // Сохраняем все товары

	const uniqueTags = new Set()
	const uniqueBrands = new Set()

	products.forEach(product => {
		product.tags.forEach(tag => uniqueTags.add(tag))
		uniqueBrands.add(product.brand)
	})

	filtersRoot.innerHTML = ''
	const tagsFilterGroup = createFilterGroup('Tags', [...uniqueTags], 'tags')
	const brandsFilterGroup = createFilterGroup(
		'Brands',
		[...uniqueBrands],
		'brands'
	)

	filtersRoot.appendChild(tagsFilterGroup)
	filtersRoot.appendChild(brandsFilterGroup)
}

initializeFilters()
