const express = require('express')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const todoRoutes = require('./routes/todos') // Маршрутизация

const app = express()

// Подключаем handlebars
const hbs = exphbs.create({
    defaultLayout: 'main', 
    extname: 'hbs'
})

// Регистрируем движок hbs
app.engine('hbs', hbs.engine) 
app.set('view engine', 'hbs')

// Указываем где лежат шаблоны страниц
app.set('views', 'views')


// === Midleware ===

// Чтобы парсить body
app.use(express.urlencoded({ extended: true })) 

// Поключение маршрутов
app.use(todoRoutes)

// Подключение css
app.use(express.static(path.join(__dirname, 'public')))


// Подключаемся к базе данных, затем поднимаем сервер
async function start () {
    try {
        await mongoose.connect('mongodb+srv://DmitryD:Azsxdc123@cluster0-scn0r.mongodb.net/CYT', {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
            // console.log('Server has been started...')
        })
    } catch (e) { // если ошибка - выводим в консоль
        console.log(e)
    }
}

start()

