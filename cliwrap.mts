import { mainWrapper } from "./testfetch.mts";

async function pushPromt() {
  let arg = process.argv;

  if (arg.length > 3) {
    console.error("Too many arguments");
    process.exit(1);
  }

  await mainWrapper(arg[2]);
}

pushPromt();
