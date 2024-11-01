interface Location {
    key: number;
    city: string;
    localizedName: string;
}

interface Weather {
    weatherText: string;
    weatherIcon: number;
    temperature: number;
}

export async function getLocation(lat: number, lng: number) {
    const response = await fetch(
        `https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_KEY}&q=${lat}%2C${lng}&language=ko-kr`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    const result = await response.json();

    if (result) {
        const location: Location = {
            key: result.ParentCity.Key,
            city: result.AdministrativeArea.LocalizedName,
            localizedName: result.ParentCity.LocalizedName,
        };
        return location;
    } else {
        throw new Error(result);
    }
}

export async function getWeather(key: number) {
    const response = await fetch(
        `https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_KEY}&language=ko-kr`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    const result = await response.json();

    if (result) {
        console.log(result);
        const weather: Weather = {
            weatherText: result[0].WeatherText,
            weatherIcon: result[0].WeatherIcon,
            temperature: result[0].Temperature.Metric.Value,
        };
        return weather;
    } else {
        throw new Error(result);
    }
}
