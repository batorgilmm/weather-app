'use client'

import { useEffect, useState } from "react";


export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('ulaanbaatar');
  const [currentForecast, setCurrentForecast] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries')

      const countries = await response.json();

      const arr = [];

      countries.data.map(country => {
        country.cities.map(city => arr.push((`${city}, ${country.country}`)))
      })

      setCountries(arr)
    }

    getData()
  }, []);


  useEffect(() => {
    const getCurrentTemp = async () => {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=64bff75e8c32478fbc631050251302&q=${selectedCountry}`);

      const currentTemp = await response.json();

      setCurrentForecast(currentTemp)
    }

    getCurrentTemp()
  }, [selectedCountry])

  const onSearchValue = (event) => {
    const filteredCountries = countries.filter(country => {
      return country.toLowerCase().startsWith(event.target.value.toLowerCase());
    })

    setFilteredCountries(filteredCountries.slice(0, 4))
  }

  const selectCountry = (index) => {
    setSelectedCountry(filteredCountries[index])
    setFilteredCountries([])
  }

  return (
    <div className="h-screen bg-gray-100 p-10">

      <br />

      {selectedCountry}

      <br />

      <input onChange={onSearchValue} className="" />

      <div>
        {filteredCountries.map((country, index) => {
          return (
            <div onClick={() => selectCountry(index)} key={country + index}>
              {country}
            </div>
          )
        })}
      </div>

      <div className="mt-10">

        {
          currentForecast && <>
            <p>
              Өдөртөө <span>{currentForecast.forecast.forecastday[0].day.maxtemp_c}</span>
            </p>

            <p>
              Шөнөдөө <span>{currentForecast.forecast.forecastday[0].day.mintemp_c}</span>
            </p>
          </>
        }

      </div>

    </div>
  );
}
