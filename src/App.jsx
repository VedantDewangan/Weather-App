import React, { useEffect, useState } from 'react'
import axios from "axios";
import "./App.css"
import IconDetail from './IconDetail';
import errorImg from "./assets/errorImage.png";

export const App = () => {
  const [locationName, SetlocationName] = useState("");
  const [search, SetSearch] = useState(false);
  const [LocationKey, SetlocationKey] = useState();
  const [currentTem, SetCurrentTem] = useState(null);
  const [currentTime, SetCurrentTime] = useState();
  const [currentWeatherIcon, SetCurrentWeatherIcon] = useState();
  const [currentWeatherText, SetCurrentWeatherText] = useState();
  const [todayMiniTem, SetTodayMiniTem] = useState();
  const [todayMaxTem, SetTodayMaxTem] = useState();
  const [lookingAHead, SetLookingAHead] = useState();
  const [todayDate, SetTodayDate] = useState("");
  const [err, SetErr] = useState();
  const [todayDay, SetTodayDay] = useState({
    Icon: null,
    IconPhrase: ""
  })
  const [todayNight, SetTodayNight] = useState({
    Icon: null,
    IconPhrase: ""
  })
  const [Data5Days, SetData5Days] = useState([]);
  const [Data12Hours, SetData12Hours] = useState([]);
  const [Loading, SetLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_APP_API_KEY;

  const HandleChange = async (e) => {
    SetlocationName(e.target.value);
  }

  const getLocationKey = async () => {
    SetLoading(true);
    try {
      const Location = await axios.get(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${locationName}`);
      SetlocationKey(Location.data[0].Key);

      const Current = await axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${Location.data[0].Key}?apikey=${apiKey}`);
      SetCurrentTem(Current.data[0].Temperature.Metric.Value);
      SetCurrentTime(Current.data[0].LocalObservationDateTime.slice(11, 16));
      SetCurrentWeatherText(Current.data[0].WeatherText);
      SetCurrentWeatherIcon(Current.data[0].WeatherIcon);

      const Today = await axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${Location.data[0].Key}?apikey=${apiKey}`);
      SetTodayMiniTem(Today.data.DailyForecasts[0].Temperature.Maximum.Value);
      SetTodayMaxTem(Today.data.DailyForecasts[0].Temperature.Minimum.Value);
      SetLookingAHead(Today.data.Headline.Text);
      SetTodayDate(Today.data.DailyForecasts[0].Date.slice(0, 10));
      SetTodayDay({
        Icon: Today.data.DailyForecasts[0].Day.Icon,
        IconPhrase: Today.data.DailyForecasts[0].Day.IconPhrase
      });
      SetTodayNight({
        Icon: Today.data.DailyForecasts[0].Night.Icon,
        IconPhrase: Today.data.DailyForecasts[0].Night.IconPhrase
      });

      const Day = await axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${Location.data[0].Key}?apikey=${apiKey}`);
      SetData5Days(Day.data.DailyForecasts);


      const Hour = await axios.get(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${Location.data[0].Key}?apikey=${apiKey}`)
      SetData12Hours(Hour.data);
    } catch (error) {
      if (error.message === "Network Error") {
        SetErr("Please check your Network Connection !!")
      }
      else {
        SetErr("Check the city name !!")
      }
    }


    SetLoading(false);
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    SetSearch(true);
    if (locationName !== "") {
      await getLocationKey();
      SetlocationName("");
    }
  }

  const FareniteToCelcius = (num) => {
    return Math.round(((num - 32) * 5) / 9);
  }

  const getIcon = (iconNumber) => {
    if (IconDetail.find(icon => icon.Icon === iconNumber)) {
      return IconDetail.find(icon => icon.Icon === iconNumber).IconImg;
    }
  }

  const getMonthName = (num) => {
    switch (num) {
      case 0:
        return `JAN`
        break;
      case 1:
        return `FEB`
        break;
      case 2:
        return `MAR`
        break;
      case 3:
        return `APR`
        break;
      case 4:
        return `MAY`
        break;
      case 5:
        return `JUN`
        break;
      case 6:
        return `JUL`
        break;
      case 7:
        return `AUG`
        break;
      case 8:
        return `SEP`
        break;
      case 9:
        return `OCT`
        break;
      case 10:
        return `NOV`
        break;
      case 11:
        return `DEC`
        break;
    }
  }

  const getDayName = (num) => {
    switch (num) {
      case 0:
        return `SUN`
        break;
      case 1:
        return `MON`
        break;
      case 2:
        return `TUE`
        break;
      case 3:
        return `WED`
        break;
      case 4:
        return `FRI`
        break;
      case 5:
        return `THU`
        break;
      case 6:
        return `SAT`
        break;
    }
  }

  const getDate = (dateString) => {
    const date = new Date(dateString);
    return `${getMonthName(date.getMonth())} ${date.getDate()}`
  }

  const getDay = (dateString) => {
    const date = new Date(dateString);
    return `${getDayName(date.getDay())}`
  }

  const getTime = (timeString) => {

    if (Number(timeString.slice(0, 2)) === 0) {
      var hour = 12;
      var AMPM = `AM`
    }
    else if (Number(timeString.slice(0, 2)) > 0 && Number(timeString.slice(0, 2)) <= 12) {
      var hour = Number(timeString.slice(0, 2))
      if (Number(timeString.slice(0, 2))) {
        var AMPM = `PM`
      }
      else {
        var AMPM = `AM`
      }
    }
    else {
      var hour = Number(timeString.slice(0, 2)) % 12
      var AMPM = 'PM'
    }

    var min = timeString.slice(3, 5);

    if (timeString.length === 2) {
      return `${hour} ${AMPM}`
    }

    return `${hour}:${min} ${AMPM}`
  }


  return (
    <>
      <div className="Main-Page">

        <form className="Input-box" onSubmit={HandleSubmit}>
          <span className="material-symbols-outlined">search</span>
          <input value={locationName} type="text" placeholder='Search City' name='locationName' autoComplete='off' onChange={HandleChange} />
          <button type="submit">SEARCH</button>
        </form>

        {
          !search ? "" :
            err ?
              <div className='Error'>
                <img src={errorImg} alt="" />
                <div>
                  ERROR OCCURRED : {err}
                </div>
              </div>
              :
              Loading ?
                <>
                  <div className='Loading'>
                    <div className='Loading-Logo'>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <p>Loading Weather..</p>
                  </div>
                </>
                :
                <>
                  <div className="Today-Weather">
                    <header>
                      <p className="Today-Weather-tag">
                        TODAY'S WEATHER
                      </p>
                      <p className="Today-Date">
                        {todayDate}
                      </p>
                    </header>
                    <hr />
                    <div className="Today-Weather-Data">
                      <img src={getIcon(todayDay.Icon)} alt="" />
                      <p>{todayDay.IconPhrase}</p>
                      <p>Hi: {FareniteToCelcius(todayMiniTem)}&deg;C</p>
                    </div>
                    <div className="Today-Weather-Data">
                      <img src={getIcon(todayNight.Icon)} alt="" />
                      <p>{todayNight.IconPhrase}</p>
                      <p>Lo: {FareniteToCelcius(todayMaxTem)}&deg;C</p>
                    </div>
                  </div>

                  <div className="Current-Weather">
                    <header>
                      <p className="Today-Weather-tag">
                        CURRENT  WEATHER
                      </p>
                      <p className="Today-Date">
                        {getTime(currentTime)}
                      </p>
                    </header>
                    <hr />
                    <div className="Current-Detail">
                      <div>
                        <img src={getIcon(currentWeatherIcon)} alt="" />
                        <p>{currentWeatherText}</p>
                      </div>
                      <div>
                        <p className='Current-Text'>{Math.round(currentTem)}&deg;C</p>
                      </div>
                    </div>
                  </div>

                  <div className="Looking-A-Head">
                    <header>
                      <p className="Today-Weather-tag">
                        LOOKING AHEAD
                      </p>
                    </header>
                    <hr />
                    <p className='Text'>{lookingAHead}</p>
                  </div>

                  <div className="Hourly-Weather">
                    <header>
                      <p className="Today-Weather-tag">
                        HOURLY WEATHER
                      </p>
                    </header>
                    <hr />
                    <div className="Hourly-Weather-Container">
                      {Data12Hours.map((hour, i) => {
                        return (
                          <div key={i} className="Conatiner">
                            <p className="Hour-Time">
                              {getTime(hour.DateTime.slice(11, 13))}
                            </p>
                            <img src={getIcon(hour.WeatherIcon)} alt="" />
                            <p>
                              {FareniteToCelcius(hour.Temperature.Value)}&deg;C
                            </p>
                            <p className='Last-Hour'>
                              {hour.PrecipitationProbability}%
                              <span className="material-symbols-outlined">water_drop</span>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="Daily-Weather">
                    <header>
                      <p className="Today-Weather-tag">
                        5-DAY WEATHER FORECAST
                      </p>
                    </header>
                    <hr />
                    {Data5Days.map((day, i) => {
                      return (
                        <div key={i} className="Daily-Container">
                          <div className='Time'>
                            <p>{getDay(day.Date.slice(0, 10))}</p>
                            <p>{getDate(day.Date.slice(0, 10))}</p>
                          </div>
                          <div className='First'>
                            <p style={{ fontSize: "1.1em" }}>{FareniteToCelcius(day.Temperature.Maximum.Value)}&deg;C</p>
                            <p>/{FareniteToCelcius(day.Temperature.Minimum.Value)}&deg;C</p>
                          </div>
                          <div className='Detailed'>
                            <div>
                              <img src={getIcon(day.Day.Icon)} alt="" />
                              <p>{day.Day.IconPhrase}</p>
                            </div>
                            <div>
                              <img src={getIcon(day.Night.Icon)} alt="" />
                              {day.Night.IconPhrase}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
        }

      </div>
    </>
  )
}