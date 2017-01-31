'use strict';

//let uuid = require('uuid');
let AWS = require("aws-sdk");

class DynamoDbDataService {
    constructor(tableName, numberOfItems){
        this.tableName = tableName;
        this.numberOfItems = numberOfItems;

        const awsDefaultRegion = process.env.AWS_DEFAULT_REGION;

        let dynamoDbParams = { region: awsDefaultRegion };

        AWS.config.update(dynamoDbParams);
    }

    /**
     * Retrieve all company activities for last 30 days
     */
    fetchbycompany(body){
        return new Promise((resolve, reject)=>{

        const data = JSON.parse(body);
        let docClient = new AWS.DynamoDB.DocumentClient();
        let fromdate = new Date(new Date().setDate(new Date().getDate()-31));
        let todate = new Date();

        var params = {
            TableName: this.tableName,
            ProjectionExpression: "#dt, #c, #n, #ispur, endpoint",
            FilterExpression: "#c = :companyValue and #dt BETWEEN :date1 AND :date2",
            ExpressionAttributeNames: {
                "#dt": "date",
                "#c": "company",
                "#n": "name",
                "#ispur": "ispurchased"
            },
            ExpressionAttributeValues: {
                ":companyValue": data.company,
                ":date1": fromdate.toISOString(),
                ":date2": todate.toISOString()
            }
        };
        docClient.scan(params, (err, data) => {
            if (err){ reject(err); }else{ resolve(data.Items); }
         });
        });
    }

    /**
     * create item 
     */
    create(body){
        return new Promise((resolve, reject)=>{

        const data = JSON.parse(body);

        const params = {
            TableName: this.tableName,
            Item: {
                endpoint: data.endpoint,//uuid.v1(),
                date: new Date().toISOString(),
                activity: data.activity,
                company: data.company,
                name: data.name,
                code: data.code,
                url: data.url,
                ispurchased: false,
                //createdAt: timestamp,
            },
        };

        //write the database
        let docClient = new AWS.DynamoDB.DocumentClient();
        docClient.put(params, (err, data) => {
            if (err){ reject(err); }else{ resolve(data); }
         });
        });
    }

    /**
     * update item
     */
    update(body){
        return new Promise((resolve, reject)=>{

        let data = JSON.parse(body);
        let docClient = new AWS.DynamoDB.DocumentClient();
        let fromdate = new Date(new Date().setDate(new Date().getDate()-15));
        let todate = new Date();
        const params = {
            TableName : this.tableName,
            Limit: this.numberOfItems,
            KeyConditionExpression: "#endpoint = :endpointValue and #date BETWEEN :date1 AND :date2",
            ExpressionAttributeNames:{
                "#endpoint": "endpoint",
                "#date": "date"//,
                //"#productcode": "code"
            },
            ExpressionAttributeValues: {
                ":endpointValue": data.endpoint,
                ":date1": fromdate.toISOString(),
                ":date2": todate.toISOString()//,
                //":codeValue": data.code
            }
        };
        function updateItem(paramsUpdate) {
            //console.log("Updating the item...");
            docClient.update(paramsUpdate, function(err, data) {

            });
        }

        docClient.query(params, (err, dt) => {
            if (err){ reject(err); }else{
                var itemIndex = 0;
                while (itemIndex < dt.Count) {
                    if(dt.Items[itemIndex].code==data.code) {
                        var paramsUpdate = {
                            TableName: this.tableName,
                            Key: {
                                "endpoint": dt.Items[itemIndex].endpoint,
                                "date": dt.Items[itemIndex].date
                            },
                            UpdateExpression: "set #n = :nameValue",
                            ExpressionAttributeNames: {
                                "#n": "ispurchased"
                            },
                            ExpressionAttributeValues: {
                                ":nameValue": true
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };
                        updateItem(paramsUpdate);
                    }
                    itemIndex++;

                }
                resolve("Done");
            }
         });

        });
    }
    
}

module.exports = DynamoDbDataService