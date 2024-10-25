const filterModal = document.getElementById('filter-modal')
const filterBtn = document.getElementById('filter-btn')
const closeModal = document.getElementById('close-modal')
const filtersRoot = document.getElementById('filters-root')

let allProducts = []
let selectedFilters = {
	tags: new Set(),
	brands: new Set(),
}

filterBtn.addEventListener('click', () => (filterModal.style.display = 'block'))
closeModal.addEventListener('click', () => (filterModal.style.display = 'none'))
window.addEventListener('click', event => {
	if (event.target === filterModal) filterModal.style.display = 'none'
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

		const label = document.createElement('span')
		label.textContent = item
		label.className = 'filter-label'
		label.addEventListener('click', () => handleFilterChange(filterType, item))
		filterItem.appendChild(label)
		filterGroup.appendChild(filterItem)
	})

	return filterGroup
}

function handleFilterChange(filterType, value) {
	if (filterType === 'tags') {
		selectedFilters.tags.has(value)
			? selectedFilters.tags.delete(value)
			: selectedFilters.tags.add(value)
	} else if (filterType === 'brands') {
		selectedFilters.brands.has(value)
			? selectedFilters.brands.delete(value)
			: selectedFilters.brands.add(value)
	}

	const filterItems = document.querySelectorAll(`.filter-label`)
	filterItems.forEach(label => {
		const labelValue = label.textContent
		const isSelected =
			(filterType === 'tags' && selectedFilters.tags.has(labelValue)) ||
			(filterType === 'brands' && selectedFilters.brands.has(labelValue))
		if (isSelected) {
			label.classList.add('active-filter')
		} else {
			label.classList.remove('active-filter')
		}
	})

	filterProducts()
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

export function updateFilterOptions(newProducts) {
	allProducts.push(...newProducts)

	const uniqueTags = new Set()
	const uniqueBrands = new Set()

	allProducts.forEach(product => {
		if (Array.isArray(product.tags)) {
			product.tags.forEach(tag => {
				if (tag && typeof tag === 'string' && tag.trim() !== '') {
					// Проверяем, что тег не пустой
					uniqueTags.add(tag.trim())
				}
			})
		}

		if (
			product.brand &&
			typeof product.brand === 'string' &&
			product.brand.trim() !== ''
		) {
			uniqueBrands.add(product.brand.trim())
		}
	})

	filtersRoot.innerHTML = ''
	filtersRoot.appendChild(createFilterGroup('Tags', [...uniqueTags], 'tags'))
	filtersRoot.appendChild(
		createFilterGroup('Brands', [...uniqueBrands], 'brands')
	)
}
