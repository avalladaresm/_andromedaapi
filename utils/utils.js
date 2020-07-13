exports.transformCountryData = (data) => {
    var t = Object.values(data.reduce((result, {
        countryCode,
        countryName,
        stateId,
        stateName,
        cityId,
        cityName
    }) => {
        // Create new group
        if (!result[0]) result[0] = {
            countryCode,
            countryName,
            states: []
        };
        // Append to group
        let state = -1;
        for (let i = 0; i < result[0].states.length; i++) {
            if (result[0].states[i].stateId == stateId)
                state = i;
        }
        if (state == -1) {
            result[0].states.push({
                stateId,
                stateName,
                cities: [{
                    cityId,
                    cityName
                }]
            });
        } else {
            result[0].states[state].cities.push({
                cityId,
                cityName
            });
        }
        return result;
    }, {}));
    
    return t[0]
}
