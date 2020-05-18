


module.exports = function(req, res, next) {
    res.status(400).render('404', {
        title: 'Страница не найдена'
    })
}