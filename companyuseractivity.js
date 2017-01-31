'use strict';

const services = require('./services');
let DynamoDbDataService = services.DynamoDbDataService;
let CompanyUserActivityValidationService = services.CompanyUserActivityValidationService;

/**
 * Invoked when HTTP GET Event is triggered on /CompanyUserActivity/fetch endpoint.
 */
module.exports.fetch = (event, context, callback) => {
  const requestPayload = event.body;

  const TABLE_NAME = 'CompanyUserActivity';
  const NUMBER_OF_ITEMS = 100;
  let dynamoDbDataService = new DynamoDbDataService(TABLE_NAME, NUMBER_OF_ITEMS);

  dynamoDbDataService.getAll(requestPayload)
      .then((results) => {
    const response = {
      statusCode: 200,
      // HERE'S THE CRITICAL PART
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: JSON.stringify(results),
    };

  callback(null, response);
  }).catch((error) => {
    callback(error);
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

/**
 * Invoked when HTTP POST Event is triggered on /CompanyUserActivity/create endpoint.
 */
module.exports.create = (event, context, callback) => {
  const requestPayload = event.body;

  //Do simple validation to check fields
  const blogValidation = new CompanyUserActivityValidationService(requestPayload);
  if (!blogValidation.validate()){
   return callback(blogValidation.error);
  }

  const TABLE_NAME = 'CompanyUserActivity';
  const NUMBER_OF_ITEMS = 100;
  let dynamoDbDataService = new DynamoDbDataService(TABLE_NAME, NUMBER_OF_ITEMS);

  dynamoDbDataService.create(requestPayload).then((results) => {
    const response = {
      statusCode: 200,
      // HERE'S THE CRITICAL PART
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: "Added item: "+JSON.stringify(results, null, 2),
    };

  callback(null, response);
  }).catch((error) => {
    callback(error);
  });

}