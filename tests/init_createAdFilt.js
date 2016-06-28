describe('Protractor BabelPop App', function() {

      var path = require('path');

      beforeEach(function() {
        browser.get('http://localhost:3000/#/login');
        element(by.model('model.email')).sendKeys("tester@babel.es");
        element(by.model('model.password')).sendKeys("123456789");
        element(by.id('entrarBtn')).click();

        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
        browser.sleep(1000);
        element(by.id('createAdBtn')).click();        
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/createAd');
    });

    it('Crear anuncio satisfactoriamente Filt1', function() {
        var fileToUpload = 'Testing_in_Progress2.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);
        element(by.model('model.title')).clear().sendKeys("TestFilt1");
        element(by.model('model.detail')).clear().sendKeys("detail");
        element(by.model('model.price')).clear().sendKeys(1);
        element(by.model('model.currency')).sendKeys('EUR');
        element(by.model('model.category')).sendKeys('CAT7');

        element(by.id('createAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');
    });

    it('Crear anuncio satisfactoriamente Filt2', function() {
        var fileToUpload = 'Testing_in_Progress2.jpg',
        absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);
        element(by.model('model.title')).clear().sendKeys("Prueba");
        element(by.model('model.detail')).clear().sendKeys("TestFilt2");
        element(by.model('model.price')).clear().sendKeys(5);
        element(by.model('model.currency')).sendKeys('EUR');
        element(by.model('model.category')).sendKeys('CAT7');

        element(by.id('createAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');

    });

     it('Crear anuncio satisfactoriamente Filt3', function() {
        var fileToUpload = 'Testing_in_Progress2.jpg',
        absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);
        element(by.model('model.title')).clear().sendKeys("TestFilt3");
        element(by.model('model.detail')).clear().sendKeys("TestFilt3");
        element(by.model('model.price')).clear().sendKeys(10);
        element(by.model('model.currency')).sendKeys('EUR');
        element(by.model('model.category')).sendKeys('CAT1');

        element(by.id('createAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');

    });

    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });
});