const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 400;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '(:' : err.stack
    });

}

export {
    errorHandler
}