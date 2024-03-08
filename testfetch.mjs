import fetch from "node-fetch";
import dotenv from 'dotenv'
import { Client } from "@notionhq/client"
import { animeProperties } from "./properties.js";

dotenv.config({ path: './.env' });

const malClientID = process.env.MAL_CLIENT_ID;
const databaseId = process.env.TABLE_ID;
const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: apiKey });

async function fetchTitle() {
  const headers = new Headers();
  headers.append("X-MAL-CLIENT-ID", malClientID);

  try {
    const response = await fetch(
      "https://api.myanimelist.net/v2/anime?q=frieren&limit=2",
      {
        method: "GET",
        headers: headers,
      },
    );

    if (!response.ok) {
      throw new Error("Net response was not ok");
    }

    const restDdata = await response.json();
    const data = restDdata.data;

    console.log(data);

    data.forEach(item => {
      console.log(item.node.title);
    });
  } catch (error) {
    console.error("Error fetching: ", error);
  }
}

async function addPageToDatabase(databaseId, pageProperties) {
  const newPage = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    icon: { emoji: '🍥' },
    properties: pageProperties,
    children: [
      {
        embed: {
          url: "https://assets-prd.ignimgs.com/2022/08/17/top25animecharacters-blogroll-1660777571580.jpg"
        }
      },
    ]
  })
}

async function main() {
  for (let i = 0; i < animeProperties.length; i++) {
    await addPageToDatabase(databaseId, animeProperties[i]);
  }
}

async function testfunc() {
  const pageId = '73b33f53f3a545c49d0aa4ac9d926672';
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(response);
}

// testfunc()
main()

// fetchTitle();
