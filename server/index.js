import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import publicFacilityRoutes from './routes/publicFacility.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

app.use(bodyParser.json({limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Servidor: Consum Equipaments Públics a Girona');
});

//Routes:
app.use('/public_facility', publicFacilityRoutes);
app.use('/user', userRoutes);

//Environment variables:
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

//Connect to MongoDB and start the server
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);