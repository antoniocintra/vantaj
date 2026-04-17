import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidUserIdResponse,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'
import { requiredFieldIsMissingResponse } from '../helpers/validation.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidUserIdResponse()
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digts_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency.',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'The type must be one of the following: EARNING, EXPENSE, INVESTMENT.',
                })
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
