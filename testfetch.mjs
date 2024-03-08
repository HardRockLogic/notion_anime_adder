import fetch from "node-fetch";
import dotenv from 'dotenv'
import { Client } from "@notionhq/client"

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
    properties: pageProperties,
  })
}

fetchTitle();
