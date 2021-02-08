import { BodyParams, Controller, Get, PathParams, Post, UseBefore} from '@tsed/common';
import { ContentType} from '@tsed/schema';
import { AuthorizeRequest } from '../middlewares/AuthorizeRequest';
import { CreateEmployeeAccount, EmployeeAccountResult } from '../models/Account';
import { EmployeeService } from '../services/EmployeeService';

@Controller('/employee')
@UseBefore(AuthorizeRequest)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) { }

  @Post('/createEmployeeAccount')
  async createEmployeeAccount(@BodyParams('data') data: CreateEmployeeAccount) {
    const d = await this.employeeService.createEmployeeAccount(data)
    return d
  }
  
  @Get('/:employerId/getCurrentEmployerEmployees')
  @ContentType('application/json')
  async getCurrentEmployerEmployees(@PathParams('employerId') employerId: number): Promise<EmployeeAccountResult[]> {
    const d = await this.employeeService.getCurrentEmployerEmployees(employerId)
    return d
  }
}