import chalk from 'chalk'
import Transaction from '../models/Transaction.model'
import {Address6} from 'ip-address'
import {v4 as uuidv4} from 'uuid'
import CommonArea from "../models/entity/CommonArea.entity"
import os from 'os'

let osHostname = os.hostname()


const getActualRequestDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9 // convert to nanoseconds
    const NS_TO_MS = 1e6 // convert to milliseconds
    const diff = process.hrtime(start)
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

const allAdvice = (req, res, next) => {

    // init ============================================================================================================
    let ip = new Address6(req.ip).inspectTeredo().client4
    if (!ip) {
        ip = req.ip
    }
    let logStart = `Start => [from ${ip}] ${req.method} ${chalk.yellow(req.url.substr(0, 40))} `
    logger.info(logStart)

    const method = req.method
    const url = req.url
    const status = res.statusCode
    const start = process.hrtime()
    const startDate = new Date()

    req['gid'] = uuidv4()

    // make commons ====================================================================================================
    const commons = new CommonArea()
    commons.gid = req['gid']
    commons.startDate = startDate
    req['commons'] = commons

    // after ===========================================================================================================
    let end = res.end
    res.end = function() {
        end.apply(res, arguments)
        const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)

        let statusColor = chalk.green(status)
        if (status !== 200) statusColor = chalk.red(status)

        // - calc human size
        let size = res.getHeader('content-length')
        let sizeReadable
        if (size < 1024) {
            sizeReadable = size + ' bytes'
        } else if (size >= 1024 && size < 1024 * 1024) {
            sizeReadable = parseInt(size / 1024) + ' kbytes'
        } else if (size >= 1024 * 1024) {
            sizeReadable = parseInt(size / 1024 / 1024) + ' MB'
        }

        let log = `End      [to   ${ip}] ${method} ${chalk.yellow(url.substr(0, 40))} ${statusColor}` +
            ` [${durationInMilliseconds.toLocaleString()} ms] [deliver ${sizeReadable}]`

        logger.info(log)

        // db save =========================================================================================================
        const tr = new Transaction()
        tr.day = startDate.toFormat('YYMMDD')
        tr.time = startDate.toFormat('HH24MISS')
        tr.url = url
        tr.ip = ip
        tr.host = osHostname
        tr.responseTime = durationInMilliseconds.toLocaleString()
        tr.status = res.statusCode
        tr.message = res.statusMessage
        tr.contentLength = size
        tr.gid = req.gid

        tr.save()
    }

    next()

}

export default allAdvice
