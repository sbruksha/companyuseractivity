'use strict';

const services = require('./services');
let DynamoDbDataService = services.DynamoDbDataService;
let CompanyUserActivityValidationService = services.CompanyUserActivityValidationService;

/**
 * Invoked when HTTP POST Event is triggered on /CompanyUserActivity/fetchall endpoint.
 */
module.exports.fetchall = (event, context, callback) => {
  const requestPayload = event.body;

  const TABLE_NAME = 'CompanyUserActivity';
  const NUMBER_OF_ITEMS = 1000;
  let dynamoDbDataService = new DynamoDbDataService(TABLE_NAME, NUMBER_OF_ITEMS);

  dynamoDbDataService.fetchall(requestPayload).then((results) => {
    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin" : "*" },
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
 * Invoked when HTTP POST Event is triggered on /CompanyUserActivity/fetchall endpoint.
 */
module.exports.fetchbydate = (event, context, callback) => {
  const requestPayload = event.body;

  const TABLE_NAME = 'CompanyUserActivity';
  const NUMBER_OF_ITEMS = 100;
  let dynamoDbDataService = new DynamoDbDataService(TABLE_NAME, NUMBER_OF_ITEMS);

  dynamoDbDataService.fetchbydate(requestPayload).then((results) => {
    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin" : "*" },
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
      headers: { "Access-Control-Allow-Origin" : "*" },
      body: "Added item: "+JSON.stringify(results, null, 2),
    };

  callback(null, response);
  }).catch((error) => {
    callback(error);
  });
}

/**
 * Invoked when HTTP POST Event is triggered on /CompanyUserActivity/update endpoint.
 */
module.exports.update = (event, context, callback) => {
  const requestPayload = event.body;

  //Do simple validation to check fields
  const blogValidation = new CompanyUserActivityValidationService(requestPayload);
  if (!blogValidation.validate()){
    return callback(blogValidation.error);
  }

  const TABLE_NAME = 'CompanyUserActivity';
  const NUMBER_OF_ITEMS = 100;
  let dynamoDbDataService = new DynamoDbDataService(TABLE_NAME, NUMBER_OF_ITEMS);

  dynamoDbDataService.update(requestPayload).then((results) => {
    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin" : "*" },
      body: "Updated item: "+JSON.stringify(results, null, 2),
    };

  callback(null, response);
}).catch((error) => {
    callback(error);
});

}