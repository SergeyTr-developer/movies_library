import { getData } from '../api/getData.js'
import { initSwiper } from '../components/swiper.js'

/**
 * Отображает список контента (фильмы или сериалы) в зависимости от указанного endpoint.
 * Получает данные о популярных фильмах или сериалах с помощью функции getData.
 * @param {string} endpoint - Конечная точка API, к которой нужно выполнить запрос.
 * @param {string} containerSelector - Селектор контейнера, в который будут добавлены элементы.
 * @param {boolean} isSlider - Флаг, указывающий, следует ли отображать контент в виде слайдера.
 * @param {string} contentType - Тип контента (например, "movie" или "tv").
 * @returns {Promise} Объект Promise.
 */
export const cardsTemplate = async (
  endpoint,
  containerSelector,
  isSlider = false,
  contentType
) => {
  const { results } = await getData(endpoint)
  results.forEach((content) => {
    const div = document.createElement('div')

    div.classList.add(isSlider ? 'swiper-slide' : 'card')
    div.dataset.id = content.id // Добавляем data-id
    div.dataset.contentType = contentType // Добавляем data-contentType

    div.innerHTML = `
        ${
          content.poster_path
            ? `<img  class=${isSlider ? 'slider-link' : 'list-item-link '}   
              } src="https://www.themoviedb.org/t/p/w300${
                content.poster_path
              }" alt="${content?.title || content?.name}" />`
            : `<div class="no-img"></div>`
        }
          <h3 class=${isSlider ? 'slider-rating' : 'list-item-rating'}>
            <svg class="rating" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.15336 2.33977L10.3267 4.68643C10.4867 5.0131 10.9134 5.32643 11.2734 5.38643L13.4 5.73977C14.76 5.96643 15.08 6.9531 14.1 7.92643L12.4467 9.57977C12.1667 9.85977 12.0134 10.3998 12.1 10.7864L12.5734 12.8331C12.9467 14.4531 12.0867 15.0798 10.6534 14.2331L8.66003 13.0531C8.30003 12.8398 7.7067 12.8398 7.34003 13.0531L5.3467 14.2331C3.92003 15.0798 3.05336 14.4464 3.4267 12.8331L3.90003 10.7864C3.9867 10.3998 3.83336 9.85977 3.55336 9.57977L1.90003 7.92643C0.926698 6.9531 1.24003 5.96643 2.60003 5.73977L4.7267 5.38643C5.08003 5.32643 5.5067 5.0131 5.6667 4.68643L6.84003 2.33977C7.48003 1.06643 8.52003 1.06643 9.15336 2.33977Z" stroke="#FFAD49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
              ${content.vote_average.toFixed(1)} / 10
            </h3>
          <div class=${isSlider ? 'slider-wrapper' : 'list-item-descr'}>
            <h3 class=${isSlider ? 'slider-title' : 'list-item-title'}>${
      content?.title || content?.name
    }</h3>
            ${
              content?.release_date
                ? `<p class=${
                    isSlider ? 'slider-subtitle' : 'list-item-subtitle'
                  }>Release: <small class="list-item-muted">${
                    content?.release_date
                  }</small></p>`
                : ''
            }
          </div>
        </a>
        
      `
    document.querySelector(containerSelector).appendChild(div)
  })
  attachListeners()
  if (isSlider) {
    initSwiper()
  }
}

const attachListeners = () => {
  const cards = document.querySelectorAll('[data-id]')
  cards.forEach((card) =>
    card.addEventListener('click', handleCardClickAndGetData)
  )
}

const handleCardClickAndGetData = async (event) => {
  // Обработка клика по div и получение data-id, data-contentType через дочерний элемент
  const id = event?.currentTarget?.dataset?.id
  const contentType = event?.currentTarget?.dataset?.contentType

  // Запрос на получение фильма по id

  const data = await getData(`${contentType}/${id} `)


  modalDetailsRender(data, contentType)
}

const modalDetailsRender = (content, contentType) => {
  const list = document.querySelector('#modal-list')
  const roundedVoteAverage = Number.parseFloat(content.vote_average.toFixed(1))

  list.innerHTML = `  
    <div  data-id=${content.id}>
      <div class = 'modal-flex-container' >
      <div><img src="https://www.themoviedb.org/t/p/w300${
        content.poster_path
      }" alt="${content.title}" /></div>
      <div class = 'modalText-flex-container' >
      <div>
      <div>
      <h1  class = 'title-fs pb-10'>
      ${
        contentType === 'movie' ? content.original_title : content.original_name
      }</h1>
      <span class='vote-average'>${roundedVoteAverage}</span>  <span>${
    content.genres[0].name || ''
  }</span>

      <p  class = 'subtitle-pt lh-25'>
      ${content.overview}</p>
      </div>
      </div>
      <div class = 'lh-25'>
      <span>${
        contentType === 'movie' ? content.release_date : content.first_air_date
      }, ${content.origin_country}
      </span>
      <p>${content.production_companies[0]?.name || ''}</p>
      </div>
      </div>
       </div>
    </div>
    `
  openModal()
}

const openModal = () => {
  const openModal = document.querySelector('#detailed-information')
  openModal.showModal()
  closeModal(openModal)
}

const closeModal = (modalToClose) => {
  const closeModalButton = document.querySelector('#close-modal-icon')
  const handleClick = () => {
    modalToClose.close()
    closeModalButton.removeEventListener('click', handleClick)
  }
  closeModalButton.addEventListener('click', handleClick)
}
