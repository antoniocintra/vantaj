import { UpdateUserUseCase } from '../use-cases/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    emailAlreadyInUseResponse,
    invalidPasswordResponse,
    invalidUserIdResponse,
    badRequest,
    ok,
    serverError,
} from './helpers/index.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidUserIdResponse()
            }

            const params = httpRequest.body

            const allowableFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowableFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated',
                })
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password)

                if (!passwordIsValid) {
                    return invalidPasswordResponse()
                }
            }

            if (params.email) {
                const isEmailFormatValid = checkIfEmailIsValid(params.email)

                if (!isEmailFormatValid) {
                    return badRequest({
                        message: 'Invalid e-mail format.',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(userId, params)

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return emailAlreadyInUseResponse()
            }

            console.error(error)
            return serverError()
        }
    }
}
