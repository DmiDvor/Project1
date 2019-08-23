const { Schema, model } = require('mongoose') // одклчаем модули из mongoose

// Создаём схему, по которой создаётся модель
const schema = new Schema ({
    title: {                    // Параметр 
        type: String,           // тип
        required: true          // запрашиваемое значение (если его нет, модель не создаётся)
    },
    completed: {                // Параметр
        type: Boolean,          // тип
        default: false          // значение по умолчанию (модель создаётся со статусом "не                                  выполнено")
    }
})


module.exports = model('Todo', schema) //Экспортируем модель (имя, схема создания)