require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

var morgan = require('morgan');
app.use(express.static('build'));
app.use(express.json());

app.use(cors());
morgan.token('data', function (req) { return JSON.stringify(req.body); });
const errorHandler = (error, req, res, next) => {
  //console.error(error.name)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error });
  }


  next(error);
};


app.get('/', morgan('tiny'), (req, res) => {
  res.send();
});

app.get('/api/persons', morgan('tiny'), (req, res) => {
  Person.find({}).then(result => {
    res.json(result);
  });
});

app.get('/info', morgan('tiny'), (req, res) => {
  const date = Date();
  Person.find({}).then(result => {
    res.send(`<div>
              <p>phonebook has info for ${result.length} people</p>
              <p>${date}</p>
            </div>`);
  });
});

app.get('/api/persons/:id', morgan('tiny'), (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  })
    .catch(error => {
      next(error);
    });
});

app.delete('/api/persons/:id', morgan('tiny'), (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        throw 'CastError';
      }
    })
    .catch(error => next(error));
});


app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :data'), (req, res, next) => {
  let body = req.body;
  const person = new Person({
    'name': body.name,
    'number': body.number
  });
  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => {
      next(error);});
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { runValidators: true, context: 'query' })
    .then(updatedPerson => {
      console.log(updatedPerson);
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        throw 'CastError';
      }
    })
    .catch(
      error => {
        next(error);
      }
    );
});
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});