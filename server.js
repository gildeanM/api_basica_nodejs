// import {createServer} from 'node:http'

// const server = createServer((request,response)=>{
    
//     response.write('Hello Node')

//     response.end()
// })

// server.listen(3333)

import {fastify} from 'fastify'
import {DatabaseMemory} from './database-memory.js'
import {DatabasePostgres} from './database-postgres.js'

const server = fastify()

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

//Sempre chamdado por padrão pelo navegador
server.get('/videos', async (request,reply)=>{

    const search = request.query.search
    // console.log(search)

    const videos = await database.list(search)

    return videos

})

//Request Body -> enviar os dados do cliente

server.post('/videos', async(request, reply )=>{

    const {title,description,duration} = request.body
    
    await database.create({
        title,
        description,
        duration,
        
    })
    
    return reply.status(201).send()
    
})

//Route Params  /s:parametroespecifico

server.put('/videos/:id', async(request, reply)=>{

    const videoId = request.params.id
    const {title,description,duration} = request.body

    await database.update(videoId, {
        title,
        description,
        duration,
    })

    return reply.status(204).send()
    
})

server.delete('/videos/:id', (request,reply)=>{

    const videoId = request.params.id

    database.delete(videoId)

    return reply.status(204).send() 

})

server.listen({
    port: process.env.PORT ?? 3333,
})