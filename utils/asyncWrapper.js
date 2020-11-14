export const AsyncWrapper = func => (req, res, next) =>
    func(req, res).catch(next)
