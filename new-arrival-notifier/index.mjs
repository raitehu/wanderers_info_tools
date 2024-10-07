export async function handler(event) {
  const endpoint = "http://localhost:2773";
  const path = "/systemsmanager/parameters/get/";
  const query = "name=%2Fprd%2Ftwitter%2Faccess_token&withDecryption=true";

  const response = await fetch(
    `${endpoint}${path}?${query}`,
    {
      headers: {
        "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN
      }
    }
  );
  const json = await response.json();
  console.log(json["Parameter"]["Value"]);

  // console.log("invoked");
  // event.Records.forEach((record) => {

    // console.log('イベント種別:', record.eventName);
    // console.log('DynamoDB Record: %j', record.dynamodb);

    // if (record.eventName === "INSERT") {
    //   console.log(record.dynamodb.NewImage);
    // } else {
    //   console.log("other events");
    // }
  // })
}
