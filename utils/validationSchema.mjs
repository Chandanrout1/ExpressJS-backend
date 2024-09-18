export const userValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username should be at least 5-32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  email: {
    notEmpty: true,
  },
};

export const queryValidateSchema = {
  filter: {
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Must be at least 3-10 characters",
    },
    notEmpty: {
      errorMessage: "Must not be empty",
    },
    isString: true,
  },
};
