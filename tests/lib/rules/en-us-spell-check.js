/**
 * @fileoverview en-us spell check
 * @author Cloud
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/en-us-spell-check"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("en-us-spell-check", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "123",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
