import { BodyParams, Controller, Get, PathParams, Put } from '@tsed/common';
import { UpdateResult } from 'typeorm';
import { UserSettings, UserSettingsToUpdate } from '../entity/UserSettingsEntity';
import { UserSettingsService } from '../services/UserSettingsService';

@Controller('/usersettings')
export class UserSettingsController {
    constructor(private userSettingsService: UserSettingsService) {}
    
    @Get('/:userId')
    async getUserSettingsByUser(@PathParams('userId') id: number): Promise<UserSettings> {
        const res = await this.userSettingsService.doesUserExists(id)
        console.log('res', res)
        const userSettings = await this.userSettingsService.getUserSettingsByUserId(id)
        return userSettings;
    }

    @Put('/:userId/update_settings')
    async updateUserSettingsByUserId(
        @PathParams('userId') userId: number, 
        @BodyParams('data') data: UserSettingsToUpdate
    ): Promise<UpdateResult> {
        const userSettings = await this.userSettingsService.updateUserSettingsByUserId(userId, data)
        return userSettings
    }
}