import { EmailAlreadyInUseError } from '../../errors/user.js'
import bcrypt from 'bcrypt'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userWithSameEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithSameEmail && userWithSameEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const userToUpdate = { ...updateUserParams }

        if (updateUserParams.password) {
            const salt = 10
            const hashedPassword = await bcrypt.hash(
                String(updateUserParams.password),
                salt,
            )
            userToUpdate.password = hashedPassword
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            userToUpdate,
        )

        return updatedUser
    }
}
