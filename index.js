const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()

const jwtSecret = 'tatakae'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
    //converte o corpo da requisição pra json
app.use(bodyParser.json())

//liberar acesso a servico como por exemplo criação de games 
function auth(req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken != undefined) {
        const bearer = authToken.split(' ')

        let token = bearer[1]

        //verificando se token é valido

        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.status(401)
                res.json({ err: 'Token Invalido' })
            } else {
                req.token = token
                req.loggedUser = { id: data.id, email: data.email }
                next()
            }
        })


    } else {
        res.status(401)
        res.json({ err: 'Token Invalido' })
    }
}

var DB = {
    games: [{
            id: 1,
            title: 'God Of War',
            year: 2011,
            price: 34
        },
        {

            id: 2,
            title: 'Fifa 12',
            year: 2012,
            price: 43
        },
        {

            id: 3,
            title: 'PES 10 ',
            year: 2010,
            price: 23

        }
    ],
    users: [{
            id: 1,
            name: 'Gabriel',
            email: 'gabriel.pr07@hotmail.com',
            password: '1234'
        },
        {
            id: 2,
            name: 'Pedro Piadas',
            email: 'pedropiadas@gmail.com',
            password: 'p3234'
        }
    ]
}

app.get('/games', auth, (req, res) => {

    let HATEOAS = [{
            href: 'http://localhost:8080/game/0',
            rel: 'delete_game',
            method: 'DELETE'
        },
        {
            href: 'http://localhost:8080/game/0',
            rel: 'get_game',
            method: 'GET'
        },
        {
            href: 'http://localhost:8080/authenticate',
            rel: 'login',
            method: 'POST'
        }
    ]

    res.statusCode = 200
    res.json({ games: DB.games, _links: HATEOAS })
})

app.get('/game/:id', auth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        parseInt(id)

        let HATEOAS = [{
                href: 'http://localhost:8080/game/' + id,
                rel: 'delete_game',
                method: 'DELETE'
            },
            {
                href: 'http://localhost:8080/game/' + id,
                rel: 'put_game',
                method: 'PUT'
            },
            {
                href: 'http://localhost:8080/game/' + id,
                rel: 'get_game',
                method: 'GET'
            },
            {
                href: 'http://localhost:8080/games',
                rel: 'get_all_games',
                method: 'GET'
            }
        ]

        var game = DB.games.find(g => g.id == id)

        if (game != undefined) {
            res.sendStatus = 200
            res.json({ game, HATEOAS })
        } else {
            res.sendStatus(404)
        }
    }
})

app.post('/game', auth, (req, res) => {
    let { title, price, year } = req.body
    DB.games.push({
        id: DB.games.length + 1,
        title,
        year,
        price
    })

    res.sendStatus(200)
})

app.delete('/game/:id', auth, (req, res) => {
    let id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        parseInt(id)
        var index = DB.games.findIndex(g => g.id == id)

        if (index == -1) {

        } else {
            DB.games.splice(index, 1)
            res.sendStatus(200)
        }

    }

})

app.put('/game/:id', auth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        parseInt(id)

        var game = DB.games.find(g => g.id == id)

        if (game != undefined) {
            let { title, price, year } = req.body


            title != undefined ? game.title = title : ''
            year != undefined ? game.year = year : ''
            price != undefined ? game.price = price : ''

            res.sendStatus(200)

        } else {
            res.sendStatus(404)
        }
    }
})

//rota pra autenticacao
app.post('/authenticate', (req, res) => {
    let { email, password } = req.body


    if (email != undefined) {
        let user = DB.users.find(u => u.email == email)

        if (user != undefined) {

            if (user.password == password) {

                //gerando jwt pro usuario   
                jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '48h' }, (err, token) => {
                    if (err) {
                        res.status(400)
                        res.json({ err: 'Credenciais invalidas' })
                    } else {
                        res.status(200)
                        res.json({ token: token })
                    }
                })

            } else {
                res.status(401)
                res.json({ err: 'Credenciais invalidas' })
            }

        } else {
            res.status(404)
            res.json({ err: 'E-mail nao encontrado!' })
        }

    } else {
        res.status(400)
        res.json({ err: 'E-mail invalido!' })
    }
})

app.listen(8080, () => {
    console.log('API RODANDO')
})