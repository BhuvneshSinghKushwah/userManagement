require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('db succesfully connected'));

const adminRouter = require('./routes/adminRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });


app.listen(process.env.PORT, () => {
    console.log(`server listening at port ${process.env.PORT}`);
})