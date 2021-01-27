import { BodyParams, Controller, Post } from '@tsed/common';
import { CreateEmployeeAccount } from '../models/Account';
import { EmployeeService } from '../services/EmployeeService';

@Controller('/employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) { }

  @Post('/createEmployeeAccount')
  async createEmployeeAccount(@BodyParams('data') data: CreateEmployeeAccount) {
    const d = await this.employeeService.createEmployeeAccount(data)
    return d
  }
}