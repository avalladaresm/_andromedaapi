import { Controller, Get, PathParams } from '@tsed/common';
import { Returns } from '@tsed/schema';
import { City, Country, State } from '../entity/Location';
import { LocationService } from '../services/LocationService';

@Controller('/location')
export class LocationController {
  constructor(private locationService: LocationService) { }

  @Get('/countries')
  @Returns(200, Array).Of(Country)
  async getCountries(): Promise<Country[]> {
    return await this.locationService.getCountries()
  }

  @Get('/country/:countryId/states')
  @Returns(200, Array).Of(State)
  async getStatesByCountry(@PathParams('countryId') countryId: string): Promise<State[]> {
    return await this.locationService.getStatesByCountry(countryId)
  }

  @Get('/state/:stateId/cities')
  @Returns(200, Array).Of(City)
  async getCitiesbyState(@PathParams('stateId') stateId: number): Promise<City[]> {
    return await this.locationService.getCitiesbyState(stateId)
  }
}