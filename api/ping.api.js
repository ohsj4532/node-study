import {Router} from 'express'
import {AsyncWrapper} from '../utils/asyncWrapper'
import PingService from '../service/ping.service'

// initialize
const router = Router()
const service = new PingService()

/**
 * Default Func for Controller
 */
export const initRouter = () => {
    const thisRouter = {
        baseUrl: '/ping',
        router: router
    }

    // router.get('/', AsyncWrapper(ping))
    router.get('/', ping)
    return thisRouter
}

export const ping = async (req, res) => {
    logger.debug(`gid: ${req['commons'].gid }`)
    const result = await service.ping()
    res.json(result)
}
