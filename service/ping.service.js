export default class PingService {

    #msg = 'pong'

    constructor() {
    }

    async ping() {
        return {msg: this.#msg}
    }

}
