import { DeleteUserUseCase } from '../use-cases/index.js'

import {
    serverError,
    checkIfIdIsValid,
    invalidUserIdResponse,
    ok,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidUserIdResponse()
            }

            const deleteUserUseCase = new DeleteUserUseCase()

            const deletedUser = await deleteUserUseCase.execute(userId)
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
