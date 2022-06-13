# Proof of concept for Language Attribute -> Language Tags

This is a super simple proof of concept that converts the language attribute of a community member to a list of tags with the format `language-<language>`.

## Installation

Clone the repository and NPM install

```
git clone git@github.com:brob/orbit-language-to-tag.git
cd orbit-language-to-tag
npm install
```

## Usage

Provide two environment variables:

`API_KEY`: The API key for the Orbit API
`WORKSPACE`: Your workspace id

Currently this is a simple Node script which can be run from the command line.

```
node index.js
```