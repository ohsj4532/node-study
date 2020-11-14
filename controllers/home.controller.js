import {Router} from 'express'
import {AsyncWrapper} from '../utils/asyncWrapper'

// initialize
const router = Router()

/**
 * Default Func for Controller
 */
export const initRouter = () => {
    const thisRouter = {
        baseUrl: '/',
        router: router
    }

    router.get('/', AsyncWrapper(home))
    return thisRouter
}

export const home = async (req, res, next) => {
    res.render('index', {
        title: 'home'
    })
}
