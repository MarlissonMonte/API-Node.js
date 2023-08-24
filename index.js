const http = require('http');
const url = require('url');

let users = [
    {
        cpf: '999.888.777-06',
        nome: 'Marlisson',
        data_nascimento: '06-10-2002'
    }
];

function listUsers(request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(users));
    console.log(JSON.stringify(users));
}

function createUser(request, response) {
    let body = '';

    request.on('data', chunk => {
        body += chunk;
    });

    request.on('end', () => {
        try {
            const newUser = JSON.parse(body);
            users.push(newUser);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(users));
            console.log('New User Added\n' + JSON.stringify(users));
        } catch (error) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Invalid JSON data' }));
        }
    });
}

const server = http.createServer((request, response) => {
    const parsedUrl = new URL(`http://localhost:3000${request.url}`);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(`Request method ${request.method} | Endpoint: ${request.url}`);

    if (parsedUrl.pathname === '/users' && request.method === 'GET') {
        listUsers(request, response);
    } else if (parsedUrl.pathname === '/users' && request.method === 'POST') {
        createUser(request, response);
    } else {
        response.writeHead(404, {'Content-Type': 'text/html' });
        response.end(`<h1>The ${parsedUrl.pathname} cannot be found</h1>`);
        console.log(`The ${parsedUrl.pathname} cannot be found`);
    }
});

server.listen(80, () => console.log('Servidor iniciado em http://localhost:3000'));



