import { badRequest, ok, serverError } from './helpers.js' // Adicionei 'ok'
import validator from 'validator'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({ message: 'Invalid user ID format' })
            }

            const updateUserParams = httpRequest.body

            const allowableFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowableFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated',
                })
            }

            if (updateUserParams.password) {
                if (updateUserParams.password.length < 6) {
                    return badRequest({
                        message: 'Password must be at least 6 characters',
                    })
                }
            }

            if (updateUserParams.email) {
                if (!validator.isEmail(updateUserParams.email)) {
                    return badRequest({ message: 'Invalid email format' })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
