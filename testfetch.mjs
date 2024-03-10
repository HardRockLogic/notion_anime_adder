import fetch from "node-fetch";
import dotenv from 'dotenv'
import { Client } from "@notionhq/client"
import { animeProperties } from "./properties.js";

dotenv.config({ path: './.env' });

const malClientID = process.env.MAL_CLIENT_ID;
const databaseId = process.env.TABLE_ID;
const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: apiKey });

async function fetchTitle(titleName, limit) {
  const headers = new Headers();
  headers.append("X-MAL-CLIENT-ID", malClientID);

  try {
    const response = await fetch(
      `https://api.myanimelist.net/v2/anime?q=${titleName}&limit=${limit}`,
      {
        method: "GET",
        headers: headers,
      },
    );

    if (!response.ok) {
      throw new Error("Net response was not ok");
    }

    const respData = await response.json();
    const data = respData.data;

    console.log(data);

    return [data[0].node.title, data[0].node.main_picture.large]

    // data.forEach(item => {
    //   console.log(item.node.title);
    // });
  } catch (error) {
    console.error("Error fetching: ", error);
  }
}

async function addPageToDatabase(databaseId, pageProperties, titleCoverUrl) {
  const newPage = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    icon: { emoji: '🍥' },
    properties: pageProperties,
    children: [
      {
        embed: {
          url: titleCoverUrl
        }
      },
    ]
  })
}

async function main() {
  const [matchedName, imageUrl] = await fetchTitle("Solo-Leveling", "1");

  // const titleCoverUrl = "https://assets-prd.ignimgs.com/2022/08/17/top25animecharacters-blogroll-1660777571580.jpg";

  animeProperties[0].Name.title[0].text.content = matchedName;


  for (let i = 0; i < animeProperties.length; i++) {
    await addPageToDatabase(databaseId, animeProperties[i], imageUrl);
  }
}

// async function testfunc() {
//   const pageId = '#';
//   const response = await notion.pages.retrieve({ page_id: pageId });
//   console.log(response);
// }

// testfunc()
main()
