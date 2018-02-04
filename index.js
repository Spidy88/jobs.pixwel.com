const pkg = require('./package.json')
const fs = require('fs')
const chalk = require('chalk')
const commander = require('commander')
const request = require('request-promise')

const log = console.log

const endpoint = 'https://jobs.pixwel.com/resumes'
let application = {
    first_name: '',
    last_name: '',
    email: '',
    position_id: '',
    explanation: '',
    projects: [],
    source: '',
    resume: ''
}

commander
    .version(pkg.version)
    .option('-f, --firstname <firstname>', 'The applicant\'s first name. Overrides the first name derived from full name')
    .option('-l, --lastname <lastname>', 'The applicant\'s last name. Overrides the last name derived from full name')
    .option('-e, --email <email>', 'The applicant\'s email')
    .option('-i, --position <position>', 'The id of the position the user is applying to')
    .option('-x, --explanation <explanation>', 'How did the applicant make the api request')
    .option('-p, --projects <projects>', 'Links to the applicant\'s projects', val => val.split(','))
    .option('-s, --source <source>', 'Where did the applicant hear about Pixwell')
    .option('-r, --resume <resumepath>', 'Path to the applicant\'s resume in pdf format')
    .parse(process.argv)

log(chalk.blue('Welcome to the Pixwel job application submission tool'))

// Transfer over the simple fields
if( commander.email ) {
    application.email = commander.email
}

if( commander.explanation ) {
    application.explanation = commander.explanation
}

if( commander.projects ) {
    application.projects = commander.projects
}

if( commander.source ) {
    application.source = commander.source
}

// Map over fields that need different property names
if( commander.firstname ) {
    application.first_name = commander.firstname
}

if( commander.lastname ) {
    application.last_name = commander.lastname
}

if( commander.position ) {
    application.position_id = commander.position
}

// If a resume path was provided, attempt to read and convert file to base64
if( commander.resume ) {
    let resume = readResume(commander.resume)
    if (!resume) {
        return
    }

    application.resume = resume
}

/**
 * Now that we've parsed all the command line arguments, we need to fill in any blanks
 * or fields that failed to parse correctly.
 */
// TODO: prompt for missing values

try {
    validateApplication(application)
    submitApplication(application)
}
catch(e) {
    log(chalk.red(e))
}

function readResume(resumePath) {
    try {
        return fs.readFileSync(resumePath).toString('base64')
    }
    catch(e) {
        log(chalk.red(handleFileError(e)))
    }
}

function handleFileError (e) {
    switch(e.code) {
        case 'EACCES':
            return 'User does not have access to the file at the given path'
        case 'ENOENT':
            return 'File does not exist at the given path'
        case 'EISDIR':
            return 'Path provided resolves to a directory'
        default:
            return 'Unable to read resume file from the given path'
    }
}

function validateApplication(app) {
    if( !app.first_name ) {
        throw "Application missing first name"
    }

    if( !app.last_name ) {
        throw "Application missing last name"
    }

    if( !app.email ) {
        throw "Application missing email"
    }

    if( !app.position_id ) {
        throw "Application missing position id"
    }

    if( !app.resume ) {
        throw "Application missing resume"
    }
}

function submitApplication(app) {
    request({
        method: 'POST',
        uri: endpoint,
        headers: {
            'Content-type': 'application/json'
        },
        json: true,
        body: app
    })
    .then((response) => {
        log(chalk.green('Application successfully submitted'))
        log(chalk.green(response.body))
    })
    .catch((reason) => {
        log(chalk.red('Failed to submit application'))
        log(chalk.red(reason))
    })
}
