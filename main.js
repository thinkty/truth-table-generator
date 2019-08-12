'use strict';

/********************************************************************

 - What is this?
 This is a truth table generator that I made to study the combination
 of multiple logic gates. I recommend using this to check your answer.
 
 - How to use
 Write your expression while keeping the format in the main function
 and run the script using node. I used node just because I wanted to
 make this program quick so that I can test it.

*********************************************************************/



/**
 * Compute given task with given value set for the task
 * @param {string[]} variables
 * @param {number[]} set
 * @param {string} task
 * @returns {boolean} true or false
 */
function compute(variables, set, task) {
    let taskArray = task.split(' ');

    // replace variable names with the actual values for computing
    for (let i = 0; i < taskArray.length; i++) {

        // has a not operator
        if (taskArray[i].includes('!')) {
            // do the not operator first
            // get the value by getting the index of the variable from the given variables list in the arguments
            taskArray[i] = set[variables.indexOf(taskArray[i].substring(1))] == 0 ? 1 : 0;

        // check if it is a variable
        } else if (variables.includes(taskArray[i])) {
            taskArray[i] = set[variables.indexOf(taskArray[i])];

        // it is an operand
        } else {
            continue;
        }
    } // for

//    // mid check - uncomment this to see the interpreted version of your expression
//    let midCheck = '';
//    for (let i = 0; i < taskArray.length; i++) {
//        midCheck += taskArray[i] + ' ';
//    }
//    console.log('Interpreted Task =  ' + midCheck);

    // start computing
    // following the order of operation and doing multiplication first
    // there should not be any division symbols
    while (taskArray.includes('*')) {
        // get the first index of *
        let index = taskArray.indexOf('*');

        // Error check that there exists numbers on left and right of the operand
        if (index != 0 && index != taskArray.length - 1) {
            
            // get the value of the left and right side
            let left = parseInt(taskArray[index - 1]);
            let right = parseInt(taskArray[index + 1]);
            
            // update the task array (ex: 0 + 1 * !0   =>   0 + 1)
            // remove elements starting from the left, index, and right
            // and replace it with a single element which is the product of left and right
            taskArray.splice(index - 1, 3, (left * right).toString());
        } else {
            console.error('ERROR: Cannot find left or right variables, check task input!');
        }
    } // while

    // after doing multiplication, do addition
    while (taskArray.includes('+')) {
        let index = taskArray.indexOf('+');

        if (index != 0 && index != taskArray.length - 1) {
            let left = parseInt(taskArray[index - 1]);
            let right = parseInt(taskArray[index + 1]);

            taskArray.splice(index - 1, 3, (left + right).toString());
        } else {
            console.error('ERROR: Cannot find left or right variables, check task input!');
        }
    } // while


    // final check: taskArray should have a length of 1 (final answer)
    if (taskArray.length != 1) {
        console.error('ERROR: Computation error, computed answer: ' + taskArray.toString());
    } else {
        // return the answer (if 0, return false)
        return taskArray[0] != 0;
    }
}


/**
 * Calculate the truth table for the given task
 * @param {string} task task to compute
 * @returns {Object} result of the computation with properties: variables, binArrays, results
 *                  - binArrays property show all the possible combinations
 *                  - results property has the same length as the binArrays and shows the results
 *                    for each computation
 */
function calculate(task) {

    // find how many variables were used in the task
    let variables = [];
    let tempTaskArray = task.split(' ');
    for (let i = 0; i < tempTaskArray.length; i++) {

        let tempItem = tempTaskArray[i];

        if (tempItem.includes('!')) {
            tempItem = tempItem.substring(1);
            if (!variables.includes(tempItem)) {
                variables.push(tempItem);
            }
        } else if (tempItem != '+' && tempItem != '*') {
            if (!variables.includes(tempItem)) {
                variables.push(tempItem);
            }
        }
    } // for
    variables.sort(); // for better comparison between different expressions

    let result = {
        variables: variables,
        binArrays: [],
        results: []
    };

    // Execute the task 2^variables.length times
    for (let i = 0; i < Math.pow(2, variables.length); i++) {
        let binString = parseInt(i).toString(2); // to binary string
        while (binString.length < variables.length) {
            binString = "0" + binString;
        }
        let binArray = binString.split('', variables.length); // to array that contains 0 or 1 for every variables
        
        // compute and get result
        result.binArrays.push(binArray);
        result.results.push(compute(variables, binArray, task));
    } // for

    return result;
}



/** 
 * main function
 */
(function main() {

    // below examples all express the same thing
    let ex1 = 'y * !z + x * y + !y * z * !k';      // yz` + xy + y`zk`
    let ex2 = 'y * !z + x * y * z + !y * z * !k';  // yz` + xyz + y`zk`
    let ex3 = '!x * y * !z * !k + !x * y * !z * k + x * y * !z * !k + x * y * !z * k + x * y * z * k + x * y * z * !k + !x * !y * z * !k + x * !y * z * !k';
    
    let result = calculate(ex1);

    // printing the result
    console.log(result.variables.toString());
    for (let i = 0; i < result.binArrays.length; i++) {
        console.log(result.binArrays[i].toString() + ' | ' + result.results[i]);
    }

})();