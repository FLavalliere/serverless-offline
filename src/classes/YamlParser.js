'use strict';

const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const resolve = require('json-refs').resolveRefs;

class YamlParser {

  constructor(serverless) {
    this.serverless = serverless;
  }

  parse(yamlFilePath) {
    let parentDir = yamlFilePath.split(path.sep);
    parentDir.pop();
    parentDir = parentDir.join('/');
    process.chdir(parentDir);

    var doc = YAML.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));
    return doc;
  }
}

module.exports = YamlParser;
