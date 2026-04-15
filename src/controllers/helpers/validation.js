import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidUserIdResponse = () =>
    badRequest({
        message: 'Invalid user ID format',
    })
