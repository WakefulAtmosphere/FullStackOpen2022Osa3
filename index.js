const express = require('express')
const app = express()
const cors = require('cors')


var morgan = require('morgan')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })



let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/', morgan('tiny'), (req, res) => {
  res.send()
})

app.get('/api/persons', morgan('tiny'), (req, res) => {
  res.json(persons)
})

app.get('/info', morgan('tiny'), (req, res) => {
  const date = Date()
  res.send(`<div>
              <p>phonebook has info for ${persons.length} people</p>
              <p>${date}</p>
            </div>`)
})

app.get('/api/persons/:id', morgan('tiny'), (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', morgan('tiny'), (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

  res.status(204).end()
})


app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :data'), (req, res) => {
  let person = req.body
  if (!(person.name && person.number)) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  } else if (persons.some(n => n.name === person.name)) {
    return res.status(400).json({ 
      error: 'entry already exists' 
    })
  }
  person = {...person, "id": Math.floor(Math.random()*10000)}
  persons = persons.concat(person)
  res.send(person)
  res.status(200).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})