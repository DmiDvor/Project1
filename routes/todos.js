const { Router } = require('express')
const Todo = require('../models/Todo') // Подключаем модель
const Words = require('../models/Words')
const router = Router()
const translate = require('../translate.js')



let randomWord
let correct = 0
let wrong = 0
let usedWords = []



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


// Маршрут на страницу Add words
router.get('/addWords', (req, res) => {
    res.render('addWords', {
        title: 'Add word',
        isAddWords: true
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


// Запрос на удаление todo из БД
router.post('/delete', async (req, res) => {
    const todo = await Todo.findById(req.body.id)
    await todo.deleteOne()
    // редирект на главную страницу
    res.redirect('/')
})

// Страничка с игрой
router.get('/translate', async (req, res) => {

    // Получаем массив слов из БД
    const words = await Words.find({})

    // Получаем случайное слово из массива
    const getWord = function () {
        let randIndex = Math.floor(Math.random() * words.length)
        randomWord = words[randIndex]
        // console.log(`Random word is:  ${randomWord}`)
        return randomWord
        
    }
    getWord()
    // Проверка на повторы
    
    const checkRepeat = function (randomWord) {
        getWord()
        try {
            if (usedWords.includes(randomWord.origin)) {
            console.log('Повтор!!!')
            
            checkRepeat(randomWord)
            } else {
            usedWords.push(randomWord.origin)
            console.log(`Used words: ${usedWords.join(', ')}`)
            
        } 
            if (usedWords.length == words.length) console.log('Thats all!!!')
            return randomWord
       } catch {
           console.log (`${randomWord} not found =(`)
       }
       
    }

    checkRepeat (randomWord)
    console.log(`After checkRepeat randomWord is: ${randomWord.origin}`)

    // Осталось слов
    let wordsLeft = words.length - usedWords.length

    // Рендерим страничку со случайным словом
    res.render('translate', {
        title: 'Translate',
        isTranslate: true,
        isCorrect: correct,
        isWrong: wrong,
        randomWord,
        wordsLeft: wordsLeft
    })
    
})

// Обработка перевода

router.post('/translate', async (req, res) => {
    
    let tryTranslate = req.body.tryTranslate

    // Проверка перевода
    if (tryTranslate == randomWord.ru) {
        correct++
    } else {
        wrong++
    }
        
    res.redirect('/translate')
})

// Кнопка reset (обнуление счётчиков)
router.post('/reset', async (req, res) => {
    correct = 0
    wrong = 0
    res.redirect('/translate')
})

// Запрос на добавления слова в базу по модели из Words.js
router.post('/addWord', async (req, res) => {
    const word = new Words({
        origin: req.body.origin,
        ru: req.body.ru
    })
    // Сохранение нового слова в базу
    await word.save()
    res.redirect('/addWords')
})




module.exports = router