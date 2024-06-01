const express = require('express')
const app = express()
var morgan = require('morgan')
const cors= require('cors')

app.use(cors())
app.use(express.json())
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


morgan.token('reqbody',(req)=>{
  if(req.method==='POST'){
    return JSON.stringify(req.body);
  }
  return '';
})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms','-',
    tokens.reqbody(req, res, 'Body')
  ].join(' ')
}))


var time= new Date();

const info =`<div>Phonebook has info for ${persons.length} people </div><div>${time}</div>`

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {

  response.json(persons)
})

app.post('/api/persons', (request, response) => {
    
    const person=request.body
    const persondup=persons.filter((persons)=>persons.name===person.name)
    if(persondup.length>0){
        const persondupname=persondup.map((x)=>x.name)
        const persondupid= persondup.map((x)=>x.id)
        response.status(400).json({error:`Contact ${persondupname} already exists in DB with id:${persondupid}`})
    
    }
    else if(person.number.length===0){
        response.status(400).json({error:`Contact ${person.name} is empty and cant be added to DB`})
    }
    else{ 
        console.log('no dup')
        const maxID=Math.floor(Math.random()*5000);
        person.id=maxID
        persons=persons.concat(person)
        response.status(201).json(person).end()
    }
    
    
  })


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    const person=persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
    
    
})

app.delete('/api/persons/:id',(request,response) =>{
    const id= Number(request.params.id)
    persons=persons.filter(person=>person.id!==id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(info)
  })

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})