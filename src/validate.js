/**
 * Checks if conditions given are satisfied
 *
 * @param array{condition: String, field: String, message: String} rules
 * @returns {isValid: Boolean, response: {error_code: String, message: Array}}
 */
const validate = (rules) => {
    const message = {}
    let isValid = true
    let response = ''
    for (const rule of rules) {
        if (rule.condition) {
            message[rule.field] = rule.message
        }
    }
    if (Object.keys(message).length > 0) {
        isValid = false
        response = {
            error_code: 'VALIDATION_ERROR',
            message
        }
    }

    return { isValid, response }
}

module.exports = validate
