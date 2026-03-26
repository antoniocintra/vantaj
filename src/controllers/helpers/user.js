import validator from 'validator'
import { badRequest } from './http.js'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters',
    })

export const emailAlreadyInUseResponse = () =>
    badRequest({
        message: 'Invalid e-mail. This e-mail is already in use',
    })

export const invalidUserIdResponse = () =>
    badRequest({
        message: 'Invalid user ID format',
    })

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
