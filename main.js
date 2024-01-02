import '/src/styles/main.scss'
import Inputmask from 'inputmask'
import Handlebars from 'handlebars'
import Swiper from 'swiper/bundle'

// import styles bundle
import 'swiper/css/bundle'

document.addEventListener('DOMContentLoaded', () => {
	const swiper = new Swiper('.swiper', {
		// slidesPerView: 4,
		spaceBetween: 20,
		// Optional parameters
		//direction: "vertical",
		// loop: false, // Отключаем бесконечную прокрутку
		// slidesPerGroup: 2,
		loop: true,
		slidesPerView: 1.2,
		slidesPerGroup: 4,
		centeredSlides: true,
		// dynamicBullets: 3,
		// dynamicMainBullets: 1,
		scrollbar: {
			el: '.swiper-scrollbar',
			dragSize: 40,
		},

		// If we need pagination
		pagination: false,
		// pagination: {
		// 	el: '.swiper-pagination',
		// 	clickable: true,
		// 	renderBullet: function (index, className) {
		// 		return '<span class="' + className + '"></span>'
		// 	},
		// },

		// Navigation arrows
		navigation: {
			nextEl: '.swiper-button-custom-next',
			prevEl: '.swiper-button-custom-prev',
		},

		breakpoints: {
			1386: {
				slidesPerView: 4,
				spaceBetween: 20,
				// loop: false, // Отключаем бесконечную прокрутку
				slidesPerGroup: 2,
				centeredSlides: false,
			},

			919: {
				slidesPerView: 3.2,
				spaceBetween: 20,
				slidesPerGroup: 2,
				centeredSlides: true,
				dynamicMainBullets: 3,
			},

			748: {
				slidesPerView: 2.65,
				slidesPerGroup: 2,
				centeredSlides: true,
				dynamicMainBullets: 3,
			},
			440: {
				slidesPerView: 1.62,
				slidesPerGroup: 4,
				spaceBetween: 20,
				centeredSlides: true,
			},
			// 	360: {},
			// 	// Добавляем точку останова для ширины экрана <= 992 пикселей
			// 	// И так далее, добавляйте другие точки останова по мере необходимости
		},
	})

	// Функция для добавления класса активному слайду
	function updateSlideClasses(activeIndex) {
		// Удаляем классы у всех слайдов
		var slides = document.querySelectorAll('.swiper-slide')
		slides.forEach(function (slide, index) {
			slide.classList.remove('active-slide', 'brightness')
			if (index === activeIndex + 1 || index === activeIndex + 2) {
				slide.classList.add('active-slide')
			} else {
				slide.classList.add('brightness')
			}
		})
	}

	function customRenderBullet(index, className, swiper) {
		if (index < 2 || index > swiper.slides.length - 3) {
			return '<span class="' + className + '">' + (index + 1) + '</span>'
		} else if (index === 2) {
			return '<span class="' + className + '">...</span>'
		}
	}

	function setInitialBullet(activeIndex) {
		const bulletIndex = calculateBulletIndex(activeIndex, swiper.slides.length)
		setActiveBulletClass(bulletIndex)
	}

	function setActiveBullet(activeIndex) {
		const bulletIndex = calculateBulletIndex(activeIndex, swiper.slides.length)
		setActiveBulletClass(bulletIndex)
	}

	function calculateBulletIndex(activeIndex, totalSlides) {
		if (activeIndex === 0) {
			return 1
		} else if (activeIndex === totalSlides - 1) {
			return 3
		} else {
			return 2
		}
	}

	function setActiveBulletClass(bulletIndex) {
		const bullets = document.querySelectorAll('.swiper-pagination-bullet')
		bullets.forEach((bullet, index) => {
			bullet.classList.toggle(
				'swiper-pagination-bullet-active',
				index + 1 === bulletIndex
			)
		})
	}

	//валидация
	//textarea
	const textareas = document.querySelectorAll('.form__text')
	// const charCounts = document.querySelectorAll('.char-counts')

	textareas.forEach((textarea, i) => {
		textarea.addEventListener('input', function () {
			var maxLength = 100 // Максимальное количество символов
			var currentLength = textarea.value.length

			// charCounts[i].textContent = currentLength + ' / ' + maxLength

			if (currentLength > maxLength) {
				textarea.value = textarea.value.substring(0, maxLength) // Обрезаем текст до максимальной длины
				// charCounts[i].style.color = '#D91141' // Можно применить другой стиль для отображения превышения символов
			} else {
				// charCounts[i].style.color = '' // Возвращаем стандартный цвет текста
			}
		})
	})

	//инпуты

	const forms = document.querySelectorAll('form')

	// const form = document.querySelector('form')

	forms.forEach(form => {
		form.addEventListener('submit', e => {
			e.preventDefault()
			sendData()
		})
		// телефон
		const phonesForm = form.querySelector('.form__phone')
		Inputmask('+7 (999) 999-99-99').mask(phonesForm)

		const nameForm = form.querySelector('.form__name')
		const commentForm = form.querySelector('.form__text')

		//отправка формы
		function sendData() {
			const telegramData = {
				name: nameForm.value,
				phone: phonesForm.value,
				text: commentForm.value,
			}
			console.log(telegramData)
			sendForm(telegramData)
		}

		//валидация
		const btnValidate = form.querySelector('.button-validate')

		btnValidate.addEventListener('click', () => {
			validateForm()
		})

		const validateForm = () => {
			if (!nameForm.checkValidity()) {
				nameForm.classList.add('invalid')
			} else {
				nameForm.classList.remove('invalid')
			}

			if (!phonesForm.checkValidity()) {
				phonesForm.classList.add('invalid')
			} else {
				phonesForm.classList.remove('invalid')
			}
		}

		async function sendForm(data) {
			try {
				const response = await fetch('/send.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				})

				if (response.ok) {
					// Данные успешно отправлены на сервер
					sendOkMessage.classList.add('show')

					if (formTwo.classList.contains('active')) {
						sendOkMessage.classList.add('show')
						formTwo.classList.remove('active')
					}

					overlayAdd()
					form.reset()
				} else {
					if (formTwo.classList.contains('active')) {
						formTwo.classList.remove('active')
					}
					sendOkMessageText.textContent('Не удалось отправить данные!')
					// sendOkMessage.classList.add('show')
					overlayAdd()
					console.error('Server responded with an error:', response.status)
				}
			} catch (error) {
				// Ошибка при выполнении запроса
				console.error('Error:', error)
			}
		}
	})

	const buttons = document.querySelectorAll('.button__open')
	const requestSection = document.querySelector('#request')
	const sendOkMessage = document.querySelector('.success-message')
	const sendOkMessageClose = document.querySelector('.success-message__close')
	const sendOkMessageText = document.querySelector('.success-message p')

	const formTwoClose = document.querySelector('.form__two-close')
	const formTwo = document.querySelector('.form__two')

	buttons.forEach(button => {
		button.addEventListener('click', e => {
			e.preventDefault()
			overlayAdd()
			formTwo.classList.add('active')
			if (burgerMenu.classList.contains('active')) {
				burgerMenu.classList.remove('active')
			}
		})
	})

	formTwoClose.addEventListener('click', () => {
		overlayRemove()
		formTwo.classList.remove('active')
		burgerButton.style.opacity = '1'

		forms.forEach(form => {
			form.reset()
			form.querySelector('.form__name').classList.remove('invalid')
			form.querySelector('.form__phone').classList.remove('invalid')
		})
	})

	sendOkMessageClose.addEventListener('click', () => {
		sendOkMessage.classList.remove('show')
		overlay.classList.remove('active')
		body.style.overflow = 'visible'
		burgerButton.style.opacity = '1'

		forms.forEach(form => {
			form.reset()

			// nameForm.classList.remove('invalid')
			// phonesForm.classList.remove('invalid')
		})
	})

	//бургер меню

	const burgerButton = document.querySelector('.burger')
	const burgerMenu = document.querySelector('.menu-burger')
	const burgerMenuClose = document.querySelector('.menu-burger__close')
	const overlay = document.querySelector('.overlay')
	const menuBurgeritems = document.querySelectorAll('.menu-burger__item')
	const body = document.querySelector('body')

	menuBurgeritems.forEach(item => {
		item.addEventListener('click', () => {
			burgerMenu.classList.remove('active')
			overlay.classList.remove('active')
			body.style.overflow = 'visible'
			burgerButton.style.opacity = '1'
		})
	})

	const overlayAdd = () => {
		overlay.classList.add('active')
		body.style.overflow = 'hidden'
	}

	const overlayRemove = () => {
		overlay.classList.remove('active')
		body.style.overflow = 'visible'
	}

	burgerButton.addEventListener('click', () => {
		burgerMenu.classList.add('active')
		overlay.classList.add('active')
		body.style.overflow = 'hidden'
		burgerButton.style.opacity = '0'
	})

	burgerMenuClose.addEventListener('click', () => {
		burgerMenu.classList.remove('active')
		overlay.classList.remove('active')
		body.style.overflow = 'visible'
		burgerButton.style.opacity = '1'
	})

	overlay.addEventListener('click', () => {
		burgerMenu.classList.remove('active')
		overlay.classList.remove('active')
		body.style.overflow = 'visible'
		burgerButton.style.opacity = '1'
		forms.forEach(form => {
			form.reset()
		})

		if (sendOkMessage.classList.contains('show')) {
			overlay.classList.remove('active')
			sendOkMessage.classList.remove('show')
		}

		if (formTwo.classList.contains('active')) {
			overlay.classList.remove('active')
			sendOkMessage.classList.remove('show')
			formTwo.classList.remove('active')

			if (burgerMenu.classList.contains('active')) {
				burgerMenu.classList.remove('active')
			}
		}
	})

	//иконки пояление
	// const socialIcons = document.querySelector('.header__socials-vertical')
	// socialIcons.classList.add('show')
})
