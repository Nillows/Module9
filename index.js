// I'm importing the 'inquirer' module to prompt the user for input through the command line.
import inquirer from 'inquirer';
// I'm importing the 'fs' module to write the README file to the system.
import fs from 'fs';

// This function returns a set of questions based on the user's preferences for optional sections.
function getQuestions(includeTOC, includeBadges, includeFeatures, includeContribute, includeTests) {
    // I'm defining an array to hold all the questions for user input.
    let questions = [
        // I'm asking for the project title.
        {
            type: 'input',
            name: 'title',
            message: 'What is your project title?',
        },
        // I'm asking for a detailed project description.
        {
            type: 'input',
            name: 'description',
            message: 'Provide a detailed description of your project. Consider explaining what motivated you to build this project, what problem it solves, and what you learned from the process:',
        },
        // I'm asking for installation instructions.
        {
            type: 'input',
            name: 'installation',
            message: 'What are the steps required to install your project?',
        },
        // I'm asking for usage instructions.
        {
            type: 'input',
            name: 'usage',
            message: 'Provide instructions and examples for use:',
        },
        // I'm asking for credits information.
        {
            type: 'input',
            name: 'credits',
            message: 'List your collaborators, if any, with links to their GitHub profiles:',
        },
        // I'm asking for license choice.
        {
            type: 'list',
            name: 'license',
            message: 'Choose a license for your project:',
            choices: ['MIT', 'GPLv2', 'Apache', 'GPLv3', 'BSD 3-clause', 'Unlicense', 'Other'],
        }
    ];

    // I'm checking if the user wants Badges and adding a question if they do.
    if (includeBadges) {
        questions.push({
            type: 'input',
            name: 'badges',
            message: 'Provide any badges links (shields.io) you want to include:',
        });
    }

    // I'm checking if the user wants a Features section and adding a question if they do.
    if (includeFeatures) {
        questions.push({
            type: 'input',
            name: 'features',
            message: 'List the features of your project:',
        });
    }

    // I'm checking if the user wants a "How to Contribute" section and adding a question if they do.
    if (includeContribute) {
        questions.push({
            type: 'input',
            name: 'contribute',
            message: 'Provide guidelines on how others can contribute to your project:',
        });
    }

    // I'm checking if the user wants a Tests section and adding a question if they do.
    if (includeTests) {
        questions.push({
            type: 'input',
            name: 'tests',
            message: 'Provide any tests written for your application and examples on how to run them:',
        });
    }

    // I'm asking for GitHub username and email - these questions are always included.
    questions.push(
        {
            type: 'input',
            name: 'githubUsername',
            message: 'Enter your GitHub Username:',
        },
        {
            type: 'input',
            name: 'email',
            message: 'Enter your email address:',
        }
    );

    // I'm returning the complete set of questions.
    return questions;
}

// This function generates the README content based on the user's answers.
function generateReadme(answers) {
    // I'm starting the README content with the project title and description.
    let readmeContent = `
# ${answers.title}

## Description 
${answers.description}
`;

    // If the user wants a Table of Contents, I'm including it in the README content.
    if (answers.includeTOC) {
        readmeContent += `
## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
`;
        // I'm adding additional sections to the Table of Contents if they provided the respective content.
        if (answers.features) readmeContent += `- [Features](#features)\n`;
        if (answers.contribute) readmeContent += `- [How to Contribute](#how-to-contribute)\n`;
        if (answers.tests) readmeContent += `- [Tests](#tests)\n`;
        readmeContent += `- [Questions](#questions)\n`;
    }

    // I'm always adding the Installation, Usage, Credits, and License sections as they're always asked.
    readmeContent += `
## Installation
${answers.installation}

## Usage 
${answers.usage}

## Credits
${answers.credits}

## License
This project is covered under the ${answers.license} license.
`;

    // I'm adding the Features, How to Contribute, and Tests sections if applicable.
    if (answers.features) {
        readmeContent += `
## Features
${answers.features}
`;
    }

    if (answers.contribute) {
        readmeContent += `
## How to Contribute
${answers.contribute}
`;
    }

    if (answers.tests) {
        readmeContent += `
## Tests
${answers.tests}
`;
    }

    // I'm always including the Questions section with GitHub and email information.
    readmeContent += `
## Questions
Find me on GitHub: [${answers.githubUsername}](https://github.com/${answers.githubUsername})
Email me with any questions: ${answers.email}
`;

    // I'm returning the complete content for the README.
    return readmeContent;
}

// I'm initially prompting the user to determine if they want a Table of Contents, Badges, Features, Contribution guidelines, and Tests sections in the README.
inquirer.prompt([
    {
        type: 'confirm',
        name: 'includeTOC',
        message: 'Would you like to include a Table of Contents?',
        default: true,
    },
    {
        type: 'confirm',
        name: 'includeBadges',
        message: 'Would you like to include Badges?',
        default: true,
    },
    {
        type: 'confirm',
        name: 'includeFeatures',
        message: 'Would you like to include a Features section?',
        default: true,
    },
    {
        type: 'confirm',
        name: 'includeContribute',
        message: 'Would you like to include a "How to Contribute" section?',
        default: true,
    },
    {
        type: 'confirm',
        name: 'includeTests',
        message: 'Would you like to include a Tests section?',
        default: true,
    }
]).then((initialAnswers) => {
    // Based on the initial responses, I'm getting the appropriate set of questions.
    const dynamicQuestions = getQuestions(initialAnswers.includeTOC, initialAnswers.includeBadges, initialAnswers.includeFeatures, initialAnswers.includeContribute, initialAnswers.includeTests);

    // I'm prompting the user with the dynamically determined set of questions.
    inquirer.prompt(dynamicQuestions).then((dynamicAnswers) => {
        // I'm combining the answers from both sets of prompts.
        const finalAnswers = { ...initialAnswers, ...dynamicAnswers };
        // I'm generating the README content based on the answers.
        const readmeContent = generateReadme(finalAnswers);
    
        // I'm writing the README file to the system and handling any errors that might occur.
        fs.writeFile('README.md', readmeContent, (err) =>
            err ? console.log(err) : console.log('Successfully created README.md!')
        );
    });
});
