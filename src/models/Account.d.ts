import { AuthLog } from "./AuthLog";

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
  platform: AuthLog
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

export interface CreateEmployeeAccount {
  name:             string,
  surname:          string,
  username:         string,
  password:         string,
  gender:           string,
  dob:              string,
  position:         string,
  contractType:     string,
  salary:           number,
  hiredOn:          string,
  email:            string,
  emailType?:       string,
  phoneNumber:      string,
  phoneNumberType?: string,
  streetAddress1?:  string,
  streetAddress2?:  string,
  zip?:             string,
  coordinates?:     string,
  cityId?:          number,
  stateId?:         number,
  countryId?:       number,
  roleId:           number,
  employerId:       number
}

export interface PersonAccountResult {
  id:                 number
  username:           string
  name:               string
  surname:            string
  gender:             string
  email:              string
  phoneNumber:        string
  streetAddressLine1: string
  streetAddressLine2: string
  zip:                string
  city:               string
  state:              string
  country:            string
  coordinates:        string
  isVerified:         boolean
  isActive:           boolean
}

export interface BusinessAccountResult {
  id:                 number
  username:           string
  name:               string
  email:              string
  phoneNumber:        string
  streetAddressLine1: string
  streetAddressLine2: string
  zip:                string
  city:               string
  state:              string
  country:            string
  coordinates:        string
  isVerified:         boolean
  isActive:           boolean
}

export interface EmployeeAccountResult {
  id:                 number
  username:           string
  name:               string
  surname:            string
  gender:             string
  dob:                string
  position:           string
  contractType:       string
  salary:             number
  hiredOn:            string
  email:              string
  emailType?:         string
  phoneNumber:        string
  phoneNumberType?:   string
  streetAddressLine1: string
  streetAddressLine2: string
  zip:                string
  city:               string
  state:              string
  country:            string
  coordinates:        string
  isVerified:         boolean
  isActive:           boolean
  role:               number
  employerId:         number
}