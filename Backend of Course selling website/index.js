const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "random1381";

const app = express();

app.use(express.json())

const users = []

// localhost:3000  (our frontend is hosted on this with the use of this code of / end point)
app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/signup", function (req, res){
    const username = req.body.username
    const password = req.body.password

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed in"
    })

    console.log(users)
})

app.post("/signin", function (req, res){
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for(let i = 0; i < users.length; i++){
        if(users[i].username === username && users[i].password === password)
            foundUser = users[i]
    }

    if(foundUser){
        const token = jwt.sign({
            username: username
        }, JWT_SECRET)

        res.json({
            token: token
        })
        // return
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    
})

function auth(req, res, next){   // Middleware for authentication
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET)

    if(decodedData.username){
        req.username = decodedData.username
        next()
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", auth, function (req, res){
    let foundUser = null;

    for(let i = 0; i < users.length; i++){
        if(users[i].username === req.username)
            foundUser = users[i]
    }
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }
)

app.listen(3000)