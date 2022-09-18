var express = require("express")

const {FieldValue} = require('firebase-admin/firestore')
var app = express()

const request = require("request")

app.use(express.json());

const PORT = 8080

const { db } = require('./firebase_1.js')

const friends = {
    'karthik': 'friend',
    'bharath': 'friend',
    'phani': 'friend',
    'rocky': 'friend',
}

app.get('/friends', async (req, res) => {
    const peopleRef = db.collection('people').doc('associates')
    const doc = await peopleRef.get()
    if (!doc.exists) {
        return res.sendStatus(400)
    }

    res.status(200).send(doc.data())
})


app.get('/friends/:name',function(req,res){
    const { name } = req.params;
    if(!name || !name in friends){
        return res.sendStatus(404)
    }
    res.status(200).send({[name]:friends[name]})
});

app.post('/addfriend', async (req, res) => {
    const { name, status } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: status
    }, { merge: true })
    res.status(200).send(friends)
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

app.listen(PORT,function(){
    console.log("Hey there I am working from http://localhost:'${PORT}'")

})