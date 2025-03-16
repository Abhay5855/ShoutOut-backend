import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.empty": "Email is required.",
      "string.min": "Email must be at least {#limit} characters.",
      "string.max": "Email cannot exceed {#limit} characters.",
      "string.email": "Please enter a valid email address.",
    }),

  username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username is required.",
    "string.min": "Username must be at least {#limit} characters.",
    "string.max": "Username cannot exceed {#limit} characters.",
    "string.alphanum": "Username can only include letters and numbers.",
  }),

  password: Joi.string()
    .trim()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least {#limit} characters.",
      "string.max": "Password cannot exceed {#limit} characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),

  first_name: Joi.string().trim().required().min(2).max(50).messages({
    "string.empty": "First name cannot be empty.",
    "string.min": "First name must be at least {#limit} characters.",
    "string.max": "First name cannot exceed {#limit} characters.",
    "string.base": "First name must be a string containing only letters",
  }),
  last_name: Joi.string().trim().required().min(2).max(50).messages({
    "string.empty": "Last name cannot be empty.",
    "string.min": "Last name must be at least {#limit} characters.",
    "string.max": "Last name cannot exceed {#limit} characters.",
    "string.base": "Last name must be a string containing only letters",
  }),
});
