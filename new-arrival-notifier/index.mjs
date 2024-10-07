export async function handler(event) {
  console.log("invoked");
  event.Records.forEach((record) => {
    console.log('イベント種別:', record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (record.eventName === "INSERT") {
      console.log(record.dynamodb.NewImage);
    } else {
      console.log("other events");
    }
  })
}
