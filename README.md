# Application submission tool for jobs.pixwel.com

This tool makes submitting an application to jobs.pixwel.com
quick, simple, and error free. Just follow the instructions
below.

### Setup instructions

Make sure you have Node v9 or greater. We recommend using nvm
to easily manage multiple node versions on your machine.

Install yarn into your global modules

```
npm install -g yarn
```

Install the projects dependencies

```
yarn
```

Run the project

```
node index.js \
    -f "First name" \
    -l "Last name" \
    -e "Email" \
    -p "Position ID" \
    -x "Optional explanation of how you submitted" \
    -p "Link1,Link2,Link3 to your projects" \
    -s "Where you found this job listing" \
    -r "path/to/resume
```

### Future improvements

* Add the ability to prompt for missing fields
* Add the ability to load application from json file

### Want to contribute?

Contributions welcome. Check out our [CONTRIBUTING.md](CONTRIBUTING.md)
