import CallOutCard from "@/Components/CallOutCard";
import InfoPanel from "@/Components/InfoPanel";
import StatCard from "@/Components/StatCard";
import Tempchart from "@/Components/Tempchart";
import Rainchart from "@/Components/Rainchart";
import { getClient } from "@/apollo-client"
import fetchWeatherQuery from "@/graphql/queries/fetchWeatherQueries";
import Humiditychart from "@/Components/Humiditychart";
import getbasepath from "@/lib/getbasepath";
import cleanData from "@/lib/cleanData";

export const revalidate = 60;

type Props = {
  params: {
    city: string;
    lat: string;
    long: string;
  }
}

async function infoPage({ params: { city, lat, long } }: Props) {
  const client = getClient();

  const { data } = await client.query({
    query: fetchWeatherQuery,
    variables: {
      current_weather: "true",
      longitude: long,
      latitude: lat,
      timezone: "GMT",
    },
  })

  const results: Root = data.myQuery;

  const dataToSend = cleanData(results, city);
  const res = await fetch(`${getbasepath()}/api/getSummery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      weatherData: dataToSend
    })
  })

  const GPTdata = await res.json();
  const { content } = GPTdata;

  console.log(results.hourly.time);

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <InfoPanel city={city} results={results} lat={lat} long={long} />

      <div className="flex-1 p-5 lg:p-10">
        <div className="p-5">
          <div className="pb-5">
            <h2 className="font-bold">Today"s Overview</h2>
            <p className="text-sm text-gray-500">
              Last Updated at:{" "}
              {new Date(results.current_weather.time).toLocaleString()} (
              {results.timezone}
              )
            </p>
          </div>

          <div className="m-2 mb-10">
            <CallOutCard 
            
            message= {content}
            
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 m-2">


            <StatCard
              title="Maximum Temperature"
              metric={`${results.daily.temperature_2m_max[0].toFixed(1)}°`}
              color="yellow"
            />



            <StatCard
              title="Minimum Temperature"
              metric={`${results.daily.temperature_2m_min[0].toFixed(1)}°`}
              color="green"
            />
            <div>
              <StatCard
                title="UV Index"
                metric={`${results.daily.uv_index_max[0].toFixed(1)}°`}
                color="rose"
              />

              {Number(results.daily.uv_index_max[0].toFixed(1)) > 5 && (
                <CallOutCard
                  message={"The UV is high today, be sure to wear SPF!"} warning
                />
              )}
            </div>

            <div className="flex space-x-3">
              <StatCard
                title="Wind Speed"
                metric={`${results.current_weather.windspeed.toFixed(1)}m/s`}
                color="cyan"
              />

              <StatCard
                title="Wind Direction"
                metric={`${results.current_weather.winddirection.toFixed(1)}°`}
                color="violet"
              />
            </div>
          </div>
        </div>
        <hr className="mb-5" />

        <div className="space-y-3">
          <Tempchart results={results} />
          <Rainchart results={results} />
          <Humiditychart results={results} />

        </div>

      </div>
    </div>
  )
}

export default infoPage
