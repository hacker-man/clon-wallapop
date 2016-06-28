describe('Protractor BabelPop App', function() {

    var path = require('path');


    beforeEach(function() {
        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        browser.get('http://localhost:3000/#/login');
        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("tests@tests.com");
        element(by.model('model.password')).sendKeys("testspass");
        element(by.id('entrarBtn')).click();

        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
        browser.sleep(1000);
        element(by.id('createAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/createAd');
    });


    it('Crea anuncio satisfactoriamente', function() {
        var fileToUpload = 'Testing_in_Progress2.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);
        element(by.model('model.title')).clear().sendKeys("Test1_createAd");
        element(by.model('model.detail')).clear().sendKeys("Detail_createAd");
        element(by.model('model.price')).clear().sendKeys(1337);
        element(by.model('model.currency')).sendKeys('EUR');
        element(by.model('model.category')).sendKeys('CAT7');

        element(by.id('createAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');
    });


    it('Crea anuncio satisfactoriamente', function() {
        var fileToUpload = 'Testing_in_Progress2.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);
        element(by.model('model.title')).clear().sendKeys("");
        element(by.model('model.detail')).clear().sendKeys("");
        element(by.model('model.price')).clear().sendKeys(1337);
        element(by.model('model.currency')).sendKeys('USD');
        element(by.model('model.category')).sendKeys('CAT1');


        expect(element(by.id('createAdBtn')).isEnabled()).toBe(false);
        element(by.id('createAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/createAd');
    });


    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });

});
