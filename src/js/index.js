import { global } from './global.js'
import { cardsTemplate } from './utils/generateTemplate.js'
import { tabsComponent } from './components/tabs.js'
/**
 * Инициализирует функции в зависимости от страницы.
 */
function init() {
  switch (global.currentPage) {
    // Если текущая страница корневая или index.html
    case '/':
    case '/index.html':
      // Вызываем функции для отображения фильмов в прокате (слайдер), а также популярных фильмов и сериалов
      tabsComponent()
      cardsTemplate('movie/now_playing', '.swiper-wrapper', true, 'movie')
      cardsTemplate('movie/popular', '.popular-movies', false, 'movie')
      cardsTemplate('tv/popular', '.popular-tv', false, 'tv')
      break
    case '/search.html':
      // Вызываем функцию для выполнения поиска
      break
  }
}

document.addEventListener('DOMContentLoaded', init)
