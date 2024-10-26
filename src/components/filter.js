const MODAL_SHOW_STYLE = 'block'
const MODAL_HIDE_STYLE = 'none'

const filterModal = document.getElementById('filter-modal')
const filterBtn = document.getElementById('filter-btn')
const closeModal = document.getElementById('close-modal')
const filtersRoot = document.getElementById('filters-root')

const ACTIVE_FILTER_CLASS = 'active-filter'
const FILTER_LABEL_CLASS = 'filter-label'
const FILTER_GROUP_CLASS = 'filter-group'
const FILTER_ITEM_CLASS = 'filter-item'

let allProducts = []
let selectedFilters = {
	tags: new Set(),
	brands: new Set(),
}

filterBtn.addEventListener(
	'click',
	() => (filterModal.style.display = MODAL_SHOW_STYLE)
)
closeModal.addEventListener(
	'click',
	() => (filterModal.style.display = MODAL_HIDE_STYLE)
)
window.addEventListener('click', event => {
	if (event.target === filterModal) filterModal.style.display = MODAL_HIDE_STYLE
})

function createFilterGroup(title, items, filterType) {
	const filterGroup = document.createElement('div')
	filterGroup.className = FILTER_GROUP_CLASS

	const groupTitle = document.createElement('h3')
	groupTitle.textContent = title
	filterGroup.appendChild(groupTitle)

	items.forEach(item => {
		const filterItem = document.createElement('div')
		filterItem.className = FILTER_ITEM_CLASS

		const label = document.createElement('span')
		label.textContent = item
		label.className = FILTER_LABEL_CLASS
		label.addEventListener('click', () => handleFilterChange(filterType, item))
		filterItem.appendChild(label)
		filterGroup.appendChild(filterItem)
	})

	return filterGroup
}

function handleFilterChange(filterType, value) {
	// Изменяем состояние выбранного фильтра
	if (filterType === 'tags') {
		selectedFilters.tags.has(value)
			? selectedFilters.tags.delete(value)
			: selectedFilters.tags.add(value)
	} else if (filterType === 'brands') {
		selectedFilters.brands.has(value)
			? selectedFilters.brands.delete(value)
			: selectedFilters.brands.add(value)
	}

	// Обновляем активные фильтры для тегов и брендов
	updateFilterActiveStates()

	// Применяем фильтры к товарам
	filterProducts()
}

// Функция для обновления состояния активности фильтров
function updateFilterActiveStates() {
	// Пройдемся по всем фильтрам
	filtersRoot.querySelectorAll(`.${FILTER_ITEM_CLASS}`).forEach(filterItem => {
		const label = filterItem.querySelector(`.${FILTER_LABEL_CLASS}`)
		const filterValue = label.textContent

		const isTagActive = selectedFilters.tags.has(filterValue)
		const isBrandActive = selectedFilters.brands.has(filterValue)

		// Добавляем или удаляем класс активности в зависимости от состояния
		if (isTagActive || isBrandActive) {
			label.classList.add(ACTIVE_FILTER_CLASS)
		} else {
			label.classList.remove(ACTIVE_FILTER_CLASS)
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

export function updateFilterOptions(newProducts) {
	allProducts.push(...newProducts)

	const uniqueTags = new Set()
	const uniqueBrands = new Set()

	allProducts.forEach(product => {
		if (Array.isArray(product.tags)) {
			product.tags.forEach(tag => {
				if (tag && typeof tag === 'string' && tag.trim() !== '') {
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

	const resetButton = document.createElement('button')
	resetButton.textContent = 'Сбросить фильтры'
	resetButton.className = 'btn__reset_filters'
	resetButton.addEventListener('click', () => {
		selectedFilters.tags.clear()
		selectedFilters.brands.clear()

		document.querySelectorAll(`.${ACTIVE_FILTER_CLASS}`).forEach(label => {
			label.classList.remove(ACTIVE_FILTER_CLASS)
		})

		const resetEvent = new CustomEvent('resetFilters')
		window.dispatchEvent(resetEvent)
	})

	filtersRoot.appendChild(resetButton)
}
