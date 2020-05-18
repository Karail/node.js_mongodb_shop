const { Router } = require('express')
const router = Router()
const Course = require('../models/Course')
const auth = require('../middleware/auth')

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc, count: c.count
    }))
}
function calcPrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/cart')
})

router.delete('/remove/:id', auth, async (req, res) => {

    console.log('qwe');

    await req.user.removeFromCart(req.params.id)

    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()

    const courses = mapCartItems(user.cart)
    const price = calcPrice(courses)

    const cart = {
        courses,
        price,
    }

    res.json(cart)
})

router.get('/', auth, async (req, res) => {

    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()

    const courses = mapCartItems(user.cart)
    const price = calcPrice(courses)

    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        courses,
        price,
    })
})

module.exports = router