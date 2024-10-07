exports.handler = (event, context, callback) => {

  event.Records.forEach((record) => {
      console.log('イベント種別:', record.eventName);
      console.log('DynamoDB Record: %j', record.dynamodb);

      if(record.eventName == 'INSERT'){
          //項目が追加された時の処理
          const newItem = record.dynamodb.NewImage;

      }else if(record.eventName == 'MODIFY'){
          //項目が変更された時の処理
          const newItem = record.dynamodb.NewImage;//変更後

      }else if(record.eventName == 'REMOVE'){
          //項目が削除された時の処理
      }else{

      }
  });

};
