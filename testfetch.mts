import fetch from "node-fetch";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { animeProperties } from "./properties.js";

dotenv.config({ path: "./.env" });

const malClientID = process.env.MAL_CLIENT_ID;
const databaseId = process.env.TABLE_ID;
const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: apiKey });

interface Node {
  node: {
    id: number;
    title: string;
    main_picture: {
      medium: string;
      large: string;
    };
  };
}

interface Data {
  data: Node[];
}

interface TitleMetaData {
  title: string;
  coverUrl: string;
}

async function fetchTitle(
  titleName: string,
  limit: string,
): Promise<TitleMetaData> {
  const headers = new Headers();
  if (malClientID !== undefined) {
    headers.append("X-MAL-CLIENT-ID", malClientID);
  }

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

    const respData = (await response.json()) as Data;
    const data = respData.data;

    console.log(data);

    return {
      title: data[0].node.title,
      coverUrl: data[0].node.main_picture.large,
    };
  } catch (error) {
    console.error("Error fetching: ", error);
    process.exit(1);
  }
}

async function addPageToDatabase(
  databaseId: string,
  pageProperties: any,
  titleCoverUrl: string,
) {
  const newPage = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    icon: { emoji: "🍥" },
    properties: pageProperties,
    children: [
      {
        embed: {
          url: titleCoverUrl,
        },
      },
    ],
  });
}

async function main() {
  const matched = await fetchTitle("My-Hero-Academy", "1")!;

  animeProperties[0].Name.title[0].text.content = matched.title;

  for (let i = 0; i < animeProperties.length; i++) {
    await addPageToDatabase(databaseId!, animeProperties[i], matched.coverUrl);
  }
}

async function getPageData(pageId: string) {
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(response);
}

main();
