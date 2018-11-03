let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');

let Message = mongoose.model('Message', {
    name: String,
    message: String
});

let Product = mongoose.model('product', {
    name: String,
    price: String,
    type: String
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise;

let dbURL = "mongodb://RhysJones:Scoobydoo2!@ds131753.mlab.com:31753/learning-node"

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', async (req, res) =>{

    try{
        let message = new Message(req.body);

        let savedMessage = await message.save();
        
        console.log('saved');

        let censored = await Message.findOne({message: 'badword'});

        if(censored) {
            console.log('censored word found', censored);
        }else{
            io.emit('message', req.body);
        }

        res.sendStatus(200);

    }
    catch(error)
    {
        re.sendStatus(500);
        return console.error(error)
    }
    finally
    {

    }    

});

app.get('/product', (req, res) => {

    if(req.query.type){
        Product.find({type: req.query.type}, (err, product) =>{
            res.send(product);  
        });
    }else{
        Product.find({}, (error, product) => {
            res.send(product);
        });
    }
});


//Snickers = http://localhost:3000/product/5bd5d2f30da9ff258cf43a78
app.get('/product/:id', (req, res) => {

    console.log(req);

    Product.find({_id: req.params.id}, (error, product) => {
        res.send(product);
    });
});

app.get('/product/type/:type', (req, res) => {

    console.log(req.params.type);

    Product.find({type: req.params.type}, (error, product) =>{
        res.send(product);
    });
});

app.post('/product', async (req, res) =>{

    try
    {
      let product = new Product(req.body);

        let saveProduct = await product.save((err, newProduct) => {
            io.emit('product', newProduct);
        });

        res.sendStatus(200);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

io.on('connection', (socket) => {
    console.log("A User Connected");
});

mongoose.connect(dbURL, {useNewUrlParser: true }, (err) =>{
    console.log("mongo DB connection", err);
});

let server = http.listen(3000, () => {
    console.log('server is listening on port: ', server.address().port);
});