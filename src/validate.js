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
