const INTERNAL_SERVER_ERROR = 500
const BAD_REQUEST = 400
const OK = 200

export const STATUS_CODES = {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    OK,
}

export class ServerError extends Error {
    constructor(message, statusCode = INTERNAL_SERVER_ERROR) {
        super(message)
        this.statusCode = statusCode
    }
}
