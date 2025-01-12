export const $Body_login_login_access_token = {
  properties: {
    grant_type: {
      type: "any-of",
      contains: [
        {
          type: "string",
          pattern: "password",
        },
        {
          type: "null",
        },
      ],
    },
    username: {
      type: "string",
      isRequired: true,
    },
    password: {
      type: "string",
      isRequired: true,
    },
    scope: {
      type: "string",
      default: "",
    },
    client_id: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    client_secret: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $Dim_PetitionCreate = {
  properties: {
    status: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    petition_title: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    petition_text: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    response: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $Dim_PetitionPrivate = {
  properties: {
    status: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    petition_title: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    petition_text: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    response: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
  },
} as const

export const $Dim_PetitionPublic = {
  properties: {
    status: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    petition_title: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    petition_text: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    response: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
    signatures: {
      type: "number",
      isRequired: true,
    },
  },
} as const

export const $Dim_PetitionPublicMe = {
  properties: {
    status: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    petition_title: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    petition_text: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    response: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
    signatures: {
      type: "number",
      isRequired: true,
    },
    action: {
      type: "string",
      isRequired: true,
    },
  },
} as const

export const $Dim_PetitionUpdate = {
  properties: {
    status: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    petition_title: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    petition_text: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    response: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $Dim_PetitionsPublic = {
  properties: {
    petitions: {
      type: "array",
      contains: {
        type: "Dim_PetitionPublic",
      },
      isRequired: true,
    },
  },
} as const

export const $Dim_PetitionsPublicMe = {
  properties: {
    petitions: {
      type: "array",
      contains: {
        type: "Dim_PetitionPublicMe",
      },
      isRequired: true,
    },
  },
} as const

export const $Dim_UserCreate = {
  properties: {
    email: {
      type: "string",
      isRequired: true,
      format: "email",
      maxLength: 255,
    },
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    dob: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    is_superuser: {
      type: "boolean",
      default: false,
    },
    password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
  },
} as const

export const $Dim_UserPublic = {
  properties: {
    email: {
      type: "string",
      isRequired: true,
      format: "email",
      maxLength: 255,
    },
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    dob: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    is_superuser: {
      type: "boolean",
      default: false,
    },
    id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
  },
} as const

export const $Dim_UserRegister = {
  properties: {
    email: {
      type: "string",
      isRequired: true,
      format: "email",
      maxLength: 255,
    },
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    dob: {
      type: "string",
      isRequired: true,
      format: "date",
    },
    bioid: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 10,
        },
        {
          type: "null",
        },
      ],
      isRequired: true,
    },
    password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
  },
} as const

export const $Dim_UserUpdate = {
  properties: {
    email: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "email",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    dob: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    is_superuser: {
      type: "boolean",
      default: false,
    },
    password: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 40,
          minLength: 8,
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $Dim_UserUpdateMe = {
  properties: {
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    email: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "email",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $Dim_UsersPublic = {
  properties: {
    data: {
      type: "array",
      contains: {
        type: "UserPublic",
      },
      isRequired: true,
    },
    count: {
      type: "number",
      isRequired: true,
    },
  },
} as const

export const $Facts_Petition = {
  properties: {
    action: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    message: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    id: {
      type: "string",
      format: "uuid",
    },
    petition_id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
    petition_affector_id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
  },
} as const

export const $Facts_PetitionCreate = {
  properties: {
    action: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    message: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $HTTPValidationError = {
  properties: {
    detail: {
      type: "array",
      contains: {
        type: "ValidationError",
      },
    },
  },
} as const

export const $ItemCreate = {
  properties: {
    title: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    description: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const

export const $ItemPublic = {
  properties: {
    title: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    description: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
    owner_id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
  },
} as const

export const $ItemUpdate = {
  properties: {
    title: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
          minLength: 1,
        },
        {
          type: "null",
        },
      ],
    },
    description: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    current_password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
    new_password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
  },
} as const

export const $ItemsPublic = {
  properties: {
    data: {
      type: "array",
      contains: {
        type: "ItemPublic",
      },
      isRequired: true,
    },
    count: {
      type: "number",
      isRequired: true,
    },
  },
} as const

export const $Message = {
  properties: {
    message: {
      type: "string",
      isRequired: true,
    },
  },
} as const

export const $NewPassword = {
  properties: {
    token: {
      type: "string",
      isRequired: true,
    },
    new_password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
  },
} as const

export const $Token = {
  properties: {
    access_token: {
      type: "string",
      isRequired: true,
    },
    token_type: {
      type: "string",
      default: "bearer",
    },
  },
} as const

export const $UpdatePassword = {
  properties: {
    current_password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
    new_password: {
      type: "string",
      isRequired: true,
      maxLength: 40,
      minLength: 8,
    },
  },
} as const

export const $UserPublic = {
  properties: {
    email: {
      type: "string",
      isRequired: true,
      format: "email",
      maxLength: 255,
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    is_superuser: {
      type: "boolean",
      default: false,
    },
    full_name: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 255,
        },
        {
          type: "null",
        },
      ],
    },
    id: {
      type: "string",
      isRequired: true,
      format: "uuid",
    },
  },
} as const

export const $ValidationError = {
  properties: {
    loc: {
      type: "array",
      contains: {
        type: "any-of",
        contains: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
      isRequired: true,
    },
    msg: {
      type: "string",
      isRequired: true,
    },
    type: {
      type: "string",
      isRequired: true,
    },
  },
} as const
