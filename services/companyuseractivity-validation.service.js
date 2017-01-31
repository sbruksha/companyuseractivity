'use strict';

let Ajv = require('ajv');

class CompanyUserActivityValidationService {
    constructor(companyuseractivity){
        this.companyuseractivity = companyuseractivity;
        //this.errors = [];
        this.error = null;

        // Each fields should be string typed value, minimum length is 1 char & whitespaces only is not allowed
        const fieldSchema = {
            "type": "string",
            "minLength": 1,
            "pattern": "\\S"
        };

        // Define CompanyUserActivity's JSON Schema
        this.schema = {
            "required": ["company", "name", "code", "url"],
            "properties": {
                "company": fieldSchema,
                "name": fieldSchema,
                "code": fieldSchema,
                "url": fieldSchema
            }
        };
    }

    /**
     * Perform validation through using AJV library
     */
    validate(){
        let ajv = new Ajv();
        const validate = ajv.compile(this.schema);
        const isValid = validate(this.companyuseractivity);
        this.error = null;
        if (!isValid) {
            // Transform each of 
            const errorMessage =
                validate.errors.map( error => this.transformAjvError(error) )
        .join('\n\r');
            this.error = new Error(errorMessage);
        }
        return isValid;
    }

    transformAjvError(ajvError){
        let errorMessage = '';
        const keyword = ajvError.keyword;
        if (keyword === 'pattern'){
            errorMessage = `"${ajvError.dataPath.replace(/[.]/g, "")}" should not be empty.`;
        }
        else if (keyword === 'required'){
            errorMessage = `"${ajvError.params.missingProperty}" is missing.`;
        }
        return errorMessage;
    }
}

module.exports = CompanyUserActivityValidationService;