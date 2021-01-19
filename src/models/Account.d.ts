export interface AccountSignupData {
  username:       string
  password:       string
  email:          string
  accountTypeId:  number
  name:           string
  surname:        string
}

export interface AccountLoginData {
  username: string
  password: string
}

export interface CreateBusinessAccount {
  name:             string,
  username:         string,
  password:         string,
  email:            string,
  phoneNumber:      string,
  streetAddress1?:  string,
  streetAddress2?:  string,
  zip?:             string,
  coordinates?:     string,
  cityId?:          number,
  stateId?:         number,
  countryId?:       number,
  accountTypeId:    number
}

export interface CreatePersonAccount {
  name:             string,
  surname:          string,
  username:         string,
  password:         string,
  email:            string,
  gender:           string,
  dob:              string,
  phoneNumber:      string,
  streetAddress1?:  string,
  streetAddress2?:  string,
  zip?:             string,
  coordinates?:     string,
  cityId?:          number,
  stateId?:         number,
  countryId?:       number,
  accountTypeId:    number
}