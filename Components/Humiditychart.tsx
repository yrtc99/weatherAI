"use client"
import { Card, AreaChart, Title} from "@tremor/react";

type Props = {
    results:Root;
}

function Humiditychart({ results}: Props) {
    const hourly = results?.hourly.time.map((time) =>
    new Date(time)
    .toLocaleString("es-US", {
        hour: "numeric",
        hour12: false,
    })).slice(0, 24)

    const data = hourly.map((hour, i) => ({
        time: Number(hour),
        "Humidity (%)": results.hourly.relativehumidity_2m[i],
        
    }))

    const dataFormatter = (number:number ) => `${number} %`;

  return (
    <Card>
        <Title>Humidity Level</Title>
        <AreaChart
            className="mt-4"
            data={data}
            showLegend
            index="time"
            categories={["Humidity (%)"]}
            colors={["teal"]}
            minValue={0}
            maxValue={100}
            valueFormatter={dataFormatter}
            yAxisWidth={40}
        />
    </Card>

      
    
  )
}

export default Humiditychart
