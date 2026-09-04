
export class AppError extends Error {

    public statusCode: number

    constructor(statusCode: number, message: string, stack = "") {
        super(message) 
        console.log(message,'this is message from app error')

        this.statusCode = statusCode

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
