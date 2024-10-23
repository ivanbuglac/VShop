import { loadProducts } from './api.js'

const filtersRoot = document.getElementById('filters-root')
let allProducts = []
let selectedFilters = {
	tags: new Set(),
	brands: new Set(),
}

// Создаем UI компонент для группы фильтров (универсальный)
function createFilterGroup(title, items, filterType) {
	const filterGroup = document.createElement('div')
	filterGroup.className = 'filter-group'

	const groupTitle = document.createElement('h3')
	groupTitle.textContent = title
	filterGroup.appendChild(groupTitle)

	items.forEach(item => {
		const filterItem = document.createElement('div')
		filterItem.className = 'filter-item'

		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.id = `${filterType}-${item}`
		checkbox.value = item
		checkbox.addEventListener('change', () =>
			handleFilterChange(filterType, item)
		)

		const label = document.createElement('label')
		label.htmlFor = `${filterType}-${item}`
		label.textContent = item

		filterItem.appendChild(checkbox)
		filterItem.appendChild(label)
		filterGroup.appendChild(filterItem)
	})

	return filterGroup
}

// Обрабатываем изменения в фильтрах
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

	filterProducts()
}

// Функция для фильтрации товаров
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

	// Событие для рендеринга отфильтрованных продуктов
	const filterEvent = new CustomEvent('filteredProducts', {
		detail: { filteredProducts },
	})
	window.dispatchEvent(filterEvent)
}

// Инициализация фильтров
async function initializeFilters() {
	allProducts = await loadProducts()

	// Извлекаем все уникальные теги и бренды
	const uniqueTags = new Set()
	const uniqueBrands = new Set()
	allProducts.forEach(product => {
		product.tags.forEach(tag => uniqueTags.add(tag))
		uniqueBrands.add(product.brand)
	})

	// Рендерим фильтры
	filtersRoot.innerHTML = '' // Очищаем фильтры перед рендерингом
	const tagsFilterGroup = createFilterGroup('Tags', [...uniqueTags], 'tags')
	const brandsFilterGroup = createFilterGroup(
		'Brands',
		[...uniqueBrands],
		'brands'
	)

	filtersRoot.appendChild(tagsFilterGroup)
	filtersRoot.appendChild(brandsFilterGroup)
}

// Скрытие/показ фильтров
let filtersVisible = false
function toggleFiltersVisibility() {
	filtersVisible = !filtersVisible
	filtersRoot.style.display = filtersVisible ? 'block' : 'none'
}

// Создание кнопки "Фильтры"
function createFilterButton() {
	const filterToggleButton = document.createElement('button')
	filterToggleButton.textContent = 'Фильтры'
	filterToggleButton.className = 'btn__toggle_filters'
	filterToggleButton.addEventListener('click', toggleFiltersVisibility)

	// Добавляем кнопку перед каталогом
	const wrapper = document.querySelector('.wrapper')
	wrapper.insertBefore(
		filterToggleButton,
		document.getElementById('catalog-root')
	)
}
createFilterButton()
// Инициализируем фильтры и создаем кнопку при загрузке страницы
initializeFilters()
