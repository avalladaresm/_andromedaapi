import { Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import os from 'os';
import { detect } from 'detect-browser';
import IPData from 'ipdata';
const ipdata = new IPData(`${process.env.IPDATA_APIKEY}`);

@Service()
export class AuthLogService {
  private connection: Connection;
  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async createLoginLog(accountId: number): Promise<void> {
    try {
      const ip = await ipdata.lookup()
      await this.connection.query('EXECUTE AuthLog_CreateLoginLog @0, @1, @2, @3, @4, @5, @6, @7, @8', [
        ip.ip, accountId, os.platform(), os.type(), os.version(), os.release(), detect()?.name, detect()?.version, detect()?.type
      ])
    }
    catch (e) {
      throw e
    }
  }
}
