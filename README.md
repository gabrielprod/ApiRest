# RestApi
Esta API é utilizada para trabalhar com dados, contendo também autenticação com JWT(JsonWebToken).
## Endpoints
### GET /games
Este endpoint é responsavel pela listagem de games.
#### Paramêtros
Nenhum
#### Respostas
##### OK! 200
Caso essa resposta ocorrer , a listagem de  dados será retornada.

Exemplo de resposta:
```

[
  {
    "id": 1,
    "title": "God Of War",
    "year": 2011,
    "price": 34
  },
  {
    "id": 2,
    "title": "Fifa 12",
    "year": 2012,
    "price": 43
  },
  {
    "id": 3,
    "title": "PES 10 ",
    "year": 2010,
    "price": 23
  }
]
```

##### Falha na autenticação! 401
Caso essa resposta aconteca, ocorreu alguma falha durante o processo de autenticação da requisição. Motivos: Token
inválido, Token expirado.

Exemplo de resposta:
```

{
  "err": "Token Invalido"
}
```

### POST /authenticate
Este endpoint é responsaveL pela autenticação do usuario na minha api, assim tendo acesso a api e nao a serviços da api, que ira ser definido posteriormente.
#### Paramêtros
email : email do usuario cadastrado no sistema.

password : senha do usuario cadastrado no sistema.

Exemplo :

```
{
	"email":"gabriel.pr07@hotmail.com",
	"password":"1234"
}
```
#### Respostas
##### OK! 200
Caso essa resposta ocorrer , voce receberá o token JWT para conseguir acessar os endpoints protegidos na API.

Exemplo de resposta:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnYWJyaWVsLnByMDdAaG90bWFpbC5jb20iLCJpYXQiOjE2MDg0Mjk1NTMsImV4cCI6MTYwODYwMjM1M30.RBLOyZonZU49zxmyRZe0ma5wXUdQUeV-Mew7A6k5Ip0"
}
```

##### Falha na autenticação! 401
Caso essa resposta aconteca, ocorreu alguma falha durante o processo de autenticação da requisição. Motivos: senha ou email incorretos.

Exemplo de resposta:
```
{ err: 'Credenciais invalidas' }

```
