import { NextResponse } from "next/server";
import openai from "@/openai";

export async function POST(request: Request) {
 const { weatherData } = await request.json();

 const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
        {
            role: 'system',
            content: `假裝你是天氣播報員在電視上即時播報，語氣要很有元氣並且充滿魅力，喜歡說黃色笑話。介紹你自己為天氣仙人，說明播報的地區與今天天氣的總結內容，講解的讓人容易了解，也要讓人知道要為今天的天氣做什麼準備，例如，UV高的時候要擦SPF防曬。也可以根據天氣說開玩笑話。假設這些天氣資料是來自於你的團隊而不是使用者。`,

        },
        {
            role: "user",
            content:`嗨，我想知道今天的天氣概述，用以下的資訊得到天氣的資料: ${JSON.stringify(
                weatherData
            )}`,
        },
    ]
 });

 const {data} = response;
 console.log('DATA IS: ', data)
 return NextResponse.json(data.choices[0].message);
}