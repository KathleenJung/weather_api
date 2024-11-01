'use client'

import { getLocation, getWeather } from "@/api/weatherApi";
import { useEffect, useState } from "react";

interface Location {
  latitude: number | null;
  longitude: number | null;
}
interface LocationData {
  key: number;
  city: string;
  localizedName: string;
}

interface Weather {
  weatherText: string;
  weatherIcon: number;
  temperature: number;
}

export default function Home() {
  const [location, setLocation] = useState<Location>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<LocationData>();
  const [weatherData, setWeatherData] = useState<Weather>();

  const fetchLocationData = async () => {
    if (location.latitude !== null && location.longitude !== null) {
      setLoading(true);
      try {
        const result = await getLocation(location.latitude, location.longitude);
        setLocationData(result);
        await fetchWeatherData(result.key);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setError("위치 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchWeatherData = async (locationKey: number) => {
    try {
      const result = await getWeather(locationKey);
      setWeatherData(result);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("날씨 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // 성공적으로 위치를 가져온 경우
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            fetchLocationData();
          },
          (err) => {
            // 위치 가져오기 실패 시 오류 메시지 저장
            setError(err.message);
          }
        );
      } else {
        // Geolocation을 지원하지 않는 브라우저의 경우 오류 메시지 저장
        setError("이 브라우저는 Geolocation을 지원하지 않습니다.");
      }
    };
    getCurrentLocation();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      fetchLocationData();
    }
  }, [location]);

  return (
    <>
      <div className="font-bold py-2">1. 브라우저로 위치 정보 받아오기</div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {error ? (
          <div className="text-red-500">오류: {error}</div>
        ) : (
          <div>
            <div className="font-bold">사용자의 현재 위치</div>
            <div>{location.latitude} / {location.longitude}</div>
          </div>
        )}
      </div>


      <div className="font-bold py-2">2. 위치 정보로 위치 키 확인하기</div>
      {locationData && (
        <div className="mt-4 text-center">
          <div className="font-bold">위치 정보</div>
          <div>도시: {locationData.city}</div>
          <div>지역명: {locationData.localizedName}</div>
          <div>위치 키: {locationData.key}</div>
        </div>
      )}

      <div className="font-bold py-2">3. 위치 키로 날씨 정보 받아오기</div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {error && <div>Error: {error}</div>}
        {loading ? (
          <div className="flex items-center">
            Loading...
          </div>
        ) : (
          locationData && weatherData && (
            <div className="flex items-center w-full justify-center">
              <img src={`/assets/weather/${weatherData.weatherIcon}-s.png`} alt="Weather Icon" className="w-1/3 h-auto" />
              <div className="text-left">
                <div className="text-3xl font-bold">{weatherData.temperature} °C</div>
                <div className="font-bold">{weatherData.weatherText}</div>
                <div className="text-slate-500">{locationData.city} {locationData.localizedName}</div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
