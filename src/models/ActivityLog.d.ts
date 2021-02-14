import { ActivityLogType } from "./ActivityLogType";

export interface ActivityLogResult {
  id:             number
  username:       string
  type:           string
  createdAt:      string
  description:    string
  data:           string
  ip:             string
  osplatform:     string
  browsername:    string
  browserversion: string
}

export interface ActivityLogCreate {
  username:       string
  typeId:         ActivityLogType
  description:    string
  data:           string
  ip:             string
  osplatform:     string
  browsername:    string
  browserversion: string
  accountExists:  1 | 0
}