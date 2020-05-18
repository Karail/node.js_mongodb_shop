
const toCurrency = (price) => (new Intl.NumberFormat('ru-RU', {
  currency: 'rub',
  style: 'currency'
}).format(price))

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})

const toDate = date => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})

const $cart = document.querySelector('#cart')

if ($cart) {
  $cart.onclick = (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      const csrf = event.target.dataset.csrf
      console.log(id);
      (async function () {
        const response = await fetch(`/cart/remove/${id}`, {
          headers: {
            'X-XSRF-TOKEN': csrf,
          },
          method: 'delete',
        })
        const data = await response.json()
        if (data.courses.length) {
          const html = data.courses.map(c => {
            return `
              <tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c._id}">Удалить</button>
                </td>
              </tr>
              `
          }).join('')
          $cart.querySelector('tbody').innerHTML = html
          $cart.querySelector('.price').textContent = toCurrency(data.price)
        } else {
          $cart.innerHTML = '<p>Корзина пуста</p>'
        }
      })()
    }
  }
}

M.Tabs.init(document.querySelectorAll('.tabs'))