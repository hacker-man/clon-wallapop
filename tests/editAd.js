describe('Protractor BabelPop App', function() {

    var emailLogin = element(by.model('model.email'));
    var passwordLogin = element(by.model('model.password'));
    var path = require('path');



    beforeEach(function() {
        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        browser.get('http://localhost:3000/#/login');
        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("tests@tests.com");
        element(by.model('model.password')).sendKeys("testspass");
        element(by.id('entrarBtn')).click();

        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        browser.sleep(2000);
        browser.get('http://localhost:3000/#/ads');
        element(by.id('eye_0')).click();
        element(by.id('editAdBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/editAd');
    });



    //TESTID:editAd1
    it('modifica datos basicos de anuncio', function() {
        element(by.model('model.ad.title')).clear().sendKeys("TestsEditado");
        element(by.model('model.ad.detail')).clear().sendKeys("ApellidosEditados");
        element(by.model('model.ad.price')).clear().sendKeys(5353);
        element(by.model('model.ad.badge')).sendKeys('USD');
        element(by.model('model.ad.category')).sendKeys('CAT1');
        element(by.model('model.ad.tags[0]')).clear().sendKeys('TagEditado1');
        browser.sleep(2000);
        element(by.id('saveAdBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');
    });


    //TESTID:editAd2
    it('modifica la foto del anuncio', function() {

        //element(by.id('changeAdPictureBtn')).click();
        var fileToUpload = 'Testing_in_Progress2.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);

        browser.sleep(2000);
        element(by.id('saveAdBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');
    });


    //TESTID:editAd4
    it('no modifica datos basicos de anuncio al dejarlo en blanco', function() {
        element(by.model('model.ad.title')).clear().sendKeys("");
        element(by.id('saveAdBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/editAd');
    });


    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });
});
