import Express from 'express'
import helmet from 'helmet'
import path from 'path'
import ConfigService from '../service/config.service';
import readReadSync from 'recursive-readdir-sync'
import expHbs from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

export default class ServerConfig {

    constructor({port, middlewares, controllerPath, apiPath}) {

        this.app = Express()
        this.app.set('env', ConfigService.NODE_ENV)
        this.app.set('port', port)
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(bodyParser.json())

        this.app.use(helmet())
        this.setViewEngine()
        this.setDb()

        middlewares.forEach(middleware => {
            this.registerMiddleware(middleware)
        })

        try {
            this.bindController(controllerPath)
            this.bindController(apiPath)
        } catch (err) {
            throw new Error(`controller bind error occurred: ${err}`)
        }

    }

    get port() {
        return this.app.get('port')
    }

    set port(number) {
        this.app.set('port', number)
    }

    registerMiddleware(middleware) {
        this.app.use(middleware)
        return this
    }

    bindController(controllerPath) {
        const controllers = path.join(controllerPath)
        logger.info(`controller bind start at ${controllerPath}`)

        readReadSync(controllers)
            .filter(file => file.split('.').pop() === 'js')
            .forEach(file => {
                try {
                    logger.info(`route bind: ${file}`)
                    const router = require(file).initRouter()
                    this.app.use(router.baseUrl, router.router)
                } catch (err) {
                    throw new Error(`${file}:${err}`)
                }
            })
    }

    async listen() {
        try {
            this.app.listen(this.port, () => {
                logger.info('==========================================================================')
                logger.info('environment       : ' + ConfigService.NODE_ENV)
                logger.info(`Listening on port : ${this.port}`)
                logger.info(`secure env check  : ${(!!process.env["isSecureEnv"])}`)
                logger.info('==========================================================================')
            })
        } catch (error) {
            logger.error(`listen error: ${error.message}`)
        }
    }

    setViewEngine() {
        const hbs = expHbs.create({
            defaultLayout: 'main',
            extname: '.hbs',
            partialsDir: [path.join(__dirname, '../views/partials')]
        })
        this.app.engine('hbs', hbs.engine)
        this.app.set('view engine', 'hbs')
        this.app.use(Express.static(path.join(__dirname, '../public')))
    }

    setDb() {
        mongoose.connect(process.env["MONGO_URL"], {useUnifiedTopology: true})
        const db = mongoose.connection
        db.once('open', () => {
            logger.info('mongo connected')
        })
    }
}
