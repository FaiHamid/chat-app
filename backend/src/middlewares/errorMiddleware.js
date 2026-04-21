export const errorMiddleware = (error, req, res, next) => {
    console.log(error);
    if (error) {
        res.statusCode = 500;
        res.send({
            message: 'Server error'
        })
    }
}