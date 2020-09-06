import express from 'express'
import benchmark from './routes/benchmark'
import sequelize from './db';

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/sync', async (req, res, next) => {
    try {
        await sequelize.sync({ alter: true })
        res.send('synced')
    } catch (e){
        next(e);
    }
})


app.use('/benchmark', benchmark)


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        error: 'Something broke!',
    })
})

module.exports = {
    path: '/api',
    handler: app
}
