const { Router } = require('express')
const router = Router()

const Course = require('../models/Course')
const auth = require('../middleware/auth')

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().lean()

    console.log(courses);


    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    })
  } catch (ex) {

  }
})

router.get('/:id/edit', auth, async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect('/courses')
    }
    const course = await Course.findById(req.params.id).lean()

    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }

    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course,
    })
  } catch (ex) {
    console.log(ex)
  }
})

router.post('/edit', auth, async (req, res) => {
  try {
    const { id } = req.body
    delete req.body.id
    const course = await Course.findById(id)
    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }
    Object.assign(course, req.body)
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {

  const course = await Course.findById(req.params.id).lean()

  res.render('course', {
    title: `Курс ${course.title}`,
    course,
  })
})

module.exports = router