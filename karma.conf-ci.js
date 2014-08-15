// Karma configuration
// Generated on Thu Aug 14 2014 04:56:24 GMT+0900 (JST)
var fs = require('fs');

module.exports = function(config) {
  if (!process.env.BROWSER_STACK_USERNAME) {
    if (!fs.existsSync('bs.json')) {
      console.log('Create a bs.json with your credentials');
      process.exit(1);
    } else {
      process.env.BROWSER_STACK_USERNAME = require('./bs').username;
      process.env.BROWSER_STACK_ACCESS_KEY = require('./bs').accessKey;
    }
  }

  var customLaunchers = {
    // Internet Explorers
    bs_ie7_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '7.0',
      os: 'Windows',
      os_version: 'XP'
    },
    bs_ie8_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '8.0',
      os: 'Windows',
      os_version: '7'
    },
    bs_ie9_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '9.0',
      os: 'Windows',
      os_version: '7'
    },
    bs_ie10_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '10.0',
      os: 'Windows',
      os_version: '8'
    },
    bs_ie11_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '11.0',
      os: 'Windows',
      os_version: '8.1'
    },
    // Chrome
    bs_chrome_mac: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '36.0',
      os: 'OS X',
      os_version: 'Mavericks'
    },
    // firefox
    bs_firefox_mac: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '31.0',
      os: 'OS X',
      os_version: 'Mavericks'
    },
    // Opera
    bs_opera_mac: {
      base: 'BrowserStack',
      browser: 'opera',
      browser_version: '12.15',
      os: 'OS X',
      os_version: 'Mavericks'
    },
    // Safari
    bs_safari7_mac: {
      base: 'BrowserStack',
      browser: 'safari',
      browser_version: '7',
      os: 'OS X',
      os_version: 'Mavericks'
    },
    bs_safari61_mac: {
      base: 'BrowserStack',
      browser: 'safari',
      browser_version: '6.1',
      os: 'OS X',
      os_version: 'Mountain Lion'
    },
    bs_safari6_mac: {
      base: 'BrowserStack',
      browser: 'safari',
      browser_version: '6',
      os: 'OS X',
      os_version: 'Lion'
    },
    // iPhone
    bs_iphone5: {
      base: 'BrowserStack',
      device: 'iPhone 5',
      os: 'ios',
      os_version: '6.0'
    },
    bs_iphone5s: {
      base: 'BrowserStack',
      device: 'iPhone 5S',
      os: 'ios',
      os_version: '7.0'
    },
    // Android
    bs_android_40: {
      base: 'BrowserStack',
      os: 'android',
      os_version: '4.0',
      device: 'Samsung Galaxy Nexus'
    },
    bs_android_41: {
      base: 'BrowserStack',
      os: 'android',
      os_version: '4.1',
      device: 'Samsung Galaxy S III'
    },
    bs_android_42: {
      base: 'BrowserStack',
      os: 'android',
      os_version: '4.2',
      device: 'LG Nexus 4'
    },
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'browserify'],


    // list of files / patterns to load in the browser
    files: [
      "test/**/*.js"
    ],

    browserify: {
      files: [
        "test/**/*.js"
      ]
    },


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/*': ['browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    browserStack: {
      project: 'magnet-inc/lookie',
      build: process.env.TRAVIS_BUILD_NUMBER || +(new Date)
    },

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),

    autoWatch: false,
    singleRun: true
  });
};
