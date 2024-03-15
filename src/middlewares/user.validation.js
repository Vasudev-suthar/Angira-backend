import { body } from "express-validator";


const registrationValidationRules = [
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
]

const changePasswordValidationRules = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('newPassword').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
]

const updateUserValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required')
]

const contactusValidationRules = [
    body('Address').notEmpty().withMessage('Address is required'),
    body('BranchAddress').notEmpty().withMessage('BranchAddress is required'),
    body('EmailAddress').notEmpty().withMessage('Email address is required').isEmail().withMessage('Valid email is required')
]

export {
    registrationValidationRules,
    changePasswordValidationRules,
    updateUserValidationRules,
    contactusValidationRules
}