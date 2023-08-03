const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect(process.env.URI, 
    { useNewUrlParser: true,
     useUnifiedTopology: true })
    .then((data) => {
        console.log(`Base de données connectée à ${data.connection.host}`)
})

