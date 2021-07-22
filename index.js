import express from "express"
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

async function index(){
dotenv.config()
try{
let x = await mongoose.connect(`mongodb+srv://shaktiv:${process.env.PASSWORD}@cluster0.7d28x.mongodb.net/TextMessageApplicationData?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
console.log('database connected')
}catch(e){
    console.log('not connected')
    console.log(e)
}

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    ts: {
        type: Date,
        required: true
    },
})

const ChatOne = new mongoose.model("ChatOne", messageSchema);
const ChatTwo = new mongoose.model("ChatTwo", messageSchema);
const ChatThree = new mongoose.model("ChatThree", messageSchema);


let app = express()
app.use(cors({ origin: true, credentials: true }))


let data = []
const createDocument = async(req) => {
    console.log(req.body)
    try {
        const document = req.body
        if(req.body.OpenedChat === 'ChatOne'){
            const newMessage = new ChatOne(document)
            newMessage.OpenedChat = undefined
            const x = await newMessage.save()
            return x._id
        }
        else if(req.body.OpenedChat === 'ChatTwo'){
            const newMessage = new ChatTwo(document)
            newMessage.OpenedChat = undefined
            const x = await newMessage.save()
            return x._id
        }
        else if(req.body.OpenedChat === 'ChatThree'){
            const newMessage = new ChatThree(document)
            newMessage.OpenedChat = undefined
            const x = await newMessage.save()
            return x._id
        }
        
    } catch (e) {
            console.log(e)
    }

}
const ReadDocument = async(req) => {
    console.log('Read Request')
    console.log(req.body)
    try {
        if(req.body.OpenedChat === 'ChatOne'){
            const result = await ChatOne.find()
            return result
        }
        else if(req.body.OpenedChat === 'ChatTwo'){
            const result = await ChatTwo.find()
            return result
        }
        else if(req.body.OpenedChat === 'ChatThree'){
            const result = await ChatThree.find()
            return result
        }
        
    } catch (e) {
        return e
    }
}

app.get('/', (req, res) => {
    res.send('Yes this worked')
})
app.use(express.json())
app.post('/incomingmessage', async(req, res) => {
    const ident = await createDocument(req)
    const idjson = {}
    idjson.id = ident
    console.log(idjson)
    res.send(idjson)
})
app.post('/readingmessages', async(req, res) => {
    const data = await ReadDocument(req)
    res.send(data)
})

app.listen(1000, () => {
    console.log('app listening')
})
}

index();