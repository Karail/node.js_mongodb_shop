const { Router } = require('express')
const router = Router()
const Course = require('../models/Course')
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
  try {

    const { title, price, img } = req.body

    console.log(req.user)

    const course = new Course({
      title,
      price,
      img,
      userId: req.user
    })

    await course.save()

    res.redirect('/courses')
  } catch (ex) {
    console.log(ex)
  }
})

module.exports = router