'use strict';

let uuid = require('uuid');
let AWS = require("aws-sdk");

class DynamoDbDataService {
    constructor(tableName, numberOfItems){
        this.tableName = tableName;
        this.numberOfItems = numberOfItems;

        const awsDefaultRegion = process.env.AWS_DEFAULT_REGION;

        let dynamoDbParams = {
            region: awsDefaultRegion
        };

        AWS.config.update(dynamoDbParams);
    }

    /**
     * Retrieve all items from table
     */
    getAll(d){
        return new Promise((resolve, reject)=>{

        const data = JSON.parse(d);
        let docClient = new AWS.DynamoDB.DocumentClient();
        let fromdate = new Date(new Date().setDate(new Date().getDate()-2));
        let todate = new Date();
        const params = {
            TableName : this.tableName,
            Limit: this.numberOfItems,
            KeyConditionExpression: "#endpoint = :endpointValue and #date BETWEEN :date1 AND :date2",
            ExpressionAttributeNames:{
                "#endpoint": "endpoint",
                "#date": "date"
            },
            ExpressionAttributeValues: {
                ":endpointValue": data.endpoint,
                ":date1": fromdate.toISOString(),
                ":date2": todate.toISOString()
            }
        };

        docClient.query(params, (err, data) => {
            if (err){
                reject(err);
            }
            else{
                resolve(data.Items);
            }
        });
        });
    }

    /**
     * create item 
     */
    create(d){
        return new Promise((resolve, reject)=>{
        //const timestamp = new Date().getTime();
        const data = JSON.parse(d);

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
                //checked: false,
                //createdAt: timestamp,
            },
        };

        //write the database
        let docClient = new AWS.DynamoDB.DocumentClient();
        docClient.put(params, (err, data) => {
            if (err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
        });
    }
    
}

module.exports = DynamoDbDataService