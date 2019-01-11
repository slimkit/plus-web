/**
 * 高性能的图片懒加载
 * 使用 IntersectionObserver API
 *
 * fuckIE: 不支持 IE 浏览器， IE 会直接加载
 * @author mutoe <mutoe@foxmail.com>
 * @example
 */

function onInserted (el, binding) {
  function loadImage () {
    el.addEventListener('load', () => {
      el.classList.add('loaded')
    })
    el.addEventListener('error', error => {
      console.error('[directive] lazyload error', error) // eslint-disable-line no-console
    })
    if (binding.arg === 'background') {
      el.style.backgroundImage = `url(${binding.value})`
    } else {
      el.src = binding.value
    }
  }

  function createObserver () {
    const options = {
      rootMargin: '2000px 0px', // 垂直方向上提前 2000 像素加载
      threshold: 0,
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }, options)
    observer.observe(el)
  }

  // fuck IE
  if (window && window.IntersectionObserver) {
    createObserver()
  } else {
    loadImage()
  }
}

export default {
  inserted: onInserted,
  updated: onInserted,
}
