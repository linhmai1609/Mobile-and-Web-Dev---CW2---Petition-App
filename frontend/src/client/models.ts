export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type Dim_PetitionCreate = {
  status: string
  petition_title?: string | null
  petition_text?: string | null
  response?: string | null
}

export type Dim_PetitionPrivate = {
  status: string
  petition_title?: string | null
  petition_text?: string | null
  petitioner: string
  response?: string | null
  id: string
}

export type Dim_PetitionPublic = {
  status: string
  petition_title?: string | null
  petition_text?: string | null
  petitioner: string
  response?: string | null
  id: string
  signatures: number
}

export type Dim_PetitionPublicMe = {
  status: string
  petition_title?: string | null
  petition_text?: string | null
  petitioner: string
  response?: string | null
  id: string
  signatures: number
  action: string
}

export type Dim_PetitionUpdate = {
  status: string
  petition_title?: string | null
  petition_text?: string | null
  petitioner: string
  response?: string | null
}

export type Dim_PetitionsPublic = {
  petitions: Array<Dim_PetitionPublic>
}

export type Dim_PetitionsPublicMe = {
  petitions: Array<Dim_PetitionPublicMe>
}

export type Dim_UserCreate = {
  email: string
  full_name?: string | null
  dob?: string | null
  is_active?: boolean
  is_superuser?: boolean
  password: string
}

export type Dim_UserPublic = {
  email: string
  full_name?: string | null
  dob?: string | null
  is_active?: boolean
  is_superuser?: boolean
  id: string
}

export type Dim_UserRegister = {
  email: string
  full_name?: string | null
  dob: string
  bioid: string | null
  password: string
}

export type Dim_UserUpdate = {
  email?: string | null
  full_name?: string | null
  dob?: string | null
  is_active?: boolean
  is_superuser?: boolean
  password?: string | null
}

export type Dim_UserUpdateMe = {
  full_name?: string | null
  email?: string | null
}

export type Dim_UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type ItemCreate = {
  title: string
  description?: string | null
}

export type ItemPublic = {
  title: string
  description?: string | null
  id: string
  owner_id: string
}

export type ItemUpdate = {
  title?: string | null
  description?: string | null
  current_password: string
  new_password: string
}

export type ItemsPublic = {
  data: Array<ItemPublic>
  count: number
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type Token = {
  access_token: string
  token_type?: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
}

export type UserPublic = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  id: string
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}
