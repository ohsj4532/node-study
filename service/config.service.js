export default class ConfigService {
    static NODE_ENV = process.env.NODE_ENV || 'dev'

    static get(name) {
        return process.env[name]
    }
}
