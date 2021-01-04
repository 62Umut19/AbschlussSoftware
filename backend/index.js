const express = require('express')
const app = express()

//body-parser is to handling easier requests
const bodyParser = require('body-parser')

//cors is there that we can access the Rest API from our website.
const cors = require('cors')

//So "process.env.PORT || 3000" means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())

app.use('/api', require('./routes/LoginRouter.js'))
app.use('/api', require('./routes/CreateRouter.js'))
app.use('/api', require('./routes/GetRouter.js'))
app.use('/api', require('./routes/SetRouter.js'))
app.use('/api', require('./routes/RemoveRouter.js'))

app.use(function (err, req, res, next) {
    if(err.code === "LIMIT_FILE_TYPES"){
        res.status(422).send({
            msg: "Nur Bilder sind erlaubt" 
        });
        return;
    }
    if(err.code === "LIMIT_FILE_SIZE"){
        res.status(422).send({
            msg: `Die Datei von Ihnen ist zu groß. Die maximal größe beträgt ${200000 / 1000} Kb ` 
        });
        return;
    }

})

// () => is a callback function
app.listen(PORT , () => console.log(`Server is running on Port ${PORT}`))