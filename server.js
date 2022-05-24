const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');
const applicationRoutes = require('./Routes/applicationsRoutes');
const mongoose = require('mongoose');
const config = require('./config/keys');
const path = require('path');
const app = express();

/******************************************MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/application', applicationRoutes);

/******************************************MongoDb Connection********************************************/
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') { // For running frontend if you are hosting both frontend and backend on the server. The server will serve the static build file in frontend/build
    app.use(express.static('./frontend/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));

    });
}

app.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));