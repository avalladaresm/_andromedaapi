import { ActivityLogCreate } from "../models/ActivityLog"
var bcrypt = require('bcrypt')

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

export const appendActivityLogDescription = (data: ActivityLogCreate) => {
  switch (data.typeId) {
    case 8:
      data.description = `${data.username} visited route ${data.data}`
      break
    default:
      return data
  }
  
  return data
}