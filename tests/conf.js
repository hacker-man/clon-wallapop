exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    allScriptsTimeout: 50000,
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },
    suites: {
        signup: 'signup.js',
        log: 'log.js',
        login: 'login.js',
        createAd: 'createAd.js',
        adList: 'adList.js',
        editUser: 'editUser.js',
        adList: 'adList.js',
        editAd: 'editAd.js',
        deleteAd: 'deleteAd.js',
        adDetail: 'adDetail.js',
        filter: 'filter.js',
        init_createUser: 'init_createUser.js',
        init_createAd: 'init_createAd.js',
        init_filter: 'init_createAdFilt.js',
        
        init: ['init_createUser.js', 'init_createAd.js'],
        sprint1: ['signup.js', 'log.js', 'login.js'],
        sprint2: ['createAd.js', 'editUser.js'],
        sprint3: ['adList.js', 'deleteAd.js', 'editAd.js', 'adDetail.js'],
        sprint4: ['init_createAdFilt.js', 'filter.js'],

        all: ['init_createUser.js', 'init_createAd.js',
            'signup.js', 'log.js', 'login.js',
            'createAd.js', 'editUser.js', 'adList.js', 'editAd.js',
            'deleteAd.js', 'adDetail.js', 'init_createAdFilt.js',
            'filter.js'
        ]
    }
}
