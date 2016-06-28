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
        browser.get('http://localhost:3000/#/ads');
    });

    //TESTID:adList1
    // it('el usuario puede ver anuncios creados por él', function() {
    //     //Creamos un nuevo anuncio
    //     element(by.id('heartOff_0')).click();
    //     expect(element(by.binding('item.likes')).getText()).toEqual('1');
    // });

    //TESTID:adList3
    it('aumenta los likes de un anuncio', function() {
        element(by.id('heartOff_0')).click();
        expect(element(by.binding('item.likes')).getText()).toEqual('1');
    });


    //TESTID:adList4
    it('disminuye los likes de un anuncio', function() {
        element(by.id('heartOn_0')).click();
        expect(element(by.binding('item.likes')).getText()).toEqual('0');
    });


    //TESTID:adList5
    it('los likes de un anuncio no cambian', function() {
        //Realizamos logout
        browser.sleep(2000);
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');

        browser.get('http://localhost:3000/#/ads');
        element(by.id('heartOff_0')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logPlease');

        browser.get('http://localhost:3000/#/ads');
        expect(element(by.binding('item.likes')).getText()).toEqual('0');

        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        browser.get('http://localhost:3000/#/login');

        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("tests@tests.com");
        element(by.model('model.password')).sendKeys("testspass");
        element(by.id('entrarBtn')).click();
    });

    //TESTID:adList6
    it('aumenta las visitas de un anuncio', function() {

        //Resolvemos promesa de getText
        element(by.id('visits_0')).getText().then(function(visits) {
            element(by.id('eye_0')).click();
            browser.get('http://localhost:3000/#/ads');
            expect(element(by.id('visits_0')).getText()).toEqual((Number(visits)+1).toString());
        });

    });


    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });
});
