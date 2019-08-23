const { Router } = require('express')
const Todo = require('../models/Todo') // Подключаем модель
const Words = require('../models/Words')
const router = Router()

let randomWord

// === Маршрутизация ===

// Корневой маршрут
router.get('/', async (req, res) => {

    const todos = await Todo.find({}) // Получение списка всех созданных todo

    res.render('index', {
        title: 'todos list',
        isIndex: true,
        todos
    })
}) 

// Маршрут на страницу create
router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create todo',
        isCreate: true
    })
})

// Запрос на создание todo по модели из Todo.js
router.post('/create', async (req, res) => {
    const todo = new Todo({
        title: req.body.title
    })
    // Сохранение todo в базу
    await todo.save()

    // редирект на главную страницу
    res.redirect('/')
})

// Запрос на зменение статуса todo на completed
router.post('/complete', async (req, res) => {
    const todo = await Todo.findById(req.body.id)
    
    todo.completed = !!req.body.completed
    // Сохранение todo в базу
    await todo.save()

    // редирект на главную страницу
    res.redirect('/')
})


// Страничка с игрой
router.get('/translate', async (req, res) => {

    // Получаем массив слов из БД
    const words = await Words.find({})

    // Получаем случайное слово из массива
    let randIndex = Math.floor(Math.random() * words.length)
    randomWord = words[randIndex]

    // Рендерим страничку со слоучайным словом
    res.render('translate', {
        title: 'Translate',
        isTranslate: true,
        randomWord
    })
})

// Обработка перевода
router.post('/translate', async (req, res) => {
    let tryTranslate = req.body.tryTranslate
    // Some code here...
    
    res.redirect('/translate')
})





module.exports = router