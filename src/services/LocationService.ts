import { Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { City, Country, State } from "../entity/Location";

@Service()
export class LocationService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async getCountries(): Promise<Country[]> {
    return await this.connection.manager.find(Country);
  }

  async getStatesByCountry(countryId: string): Promise<State[]> {
    return await this.connection.manager.find(State, { where: { country: countryId } });
  }

  async getCitiesbyState(stateId: number): Promise<City[]> {
    return await this.connection.manager.find(City, { where: { state: stateId } });
  }
}
