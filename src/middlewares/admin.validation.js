import { body } from "express-validator";


const registrationValidationRules = [
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
]

export {
    registrationValidationRules
}