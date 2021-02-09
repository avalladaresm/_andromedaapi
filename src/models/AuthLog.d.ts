export interface AuthLog {
  ip:             string
  osplatform:     string
  browsername:    string
  browserversion: string
}

export interface LogoutAuthLog{
  username: string
  authlog:  AuthLog
}

export interface AuthLogResult {
  id:             number
  type:           string
  ip:             string
  osplatform:     string
  browsername:    string
  browserversion: string
}