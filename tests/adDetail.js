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

    });



    //TESTID:adDetail1
    it('el usuario puede ver el detalle de un anuncio', function() {
        element(by.id('logoBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');
        browser.sleep(2000);
        element(by.id('eye_0')).click();
        expect(element(by.id('adImage')).isPresent()).toBe(true);
        expect(element(by.id('adTitle')).isPresent()).toBe(true);
        expect(element(by.id('adOwner')).isPresent()).toBe(true);
        expect(element(by.id('adStats')).isPresent()).toBe(true);
        expect(element(by.id('adDescription')).isPresent()).toBe(true);
        expect(element(by.id('adCategory')).isPresent()).toBe(true);
        expect(element(by.id('adPrice')).isPresent()).toBe(true);
        expect(element(by.id('adDate')).isPresent()).toBe(true);
    });


    //TESTID:adDetail5
    it('las vistas del anuncio aumentan con cada visita en el detalle', function() {
        element(by.id('logoBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/ads');
        //Resolvemos promesa de getText
        element(by.id('visits_0')).getText().then(function(visits) {
            browser.sleep(15000);
            element(by.id('eye_0')).click();
            browser.get('http://localhost:3000/#/ads');
            //Hay que esperar 15 segundos para que no se pisen
            //Volvemos al detalle de anuncio para comprobar las visitas
            element(by.id('eye_0')).click();

            element(by.id('visits')).getText().then(function(visitsDetail) {
                expect(Number(visitsDetail).toString()).toEqual((Number(visits) + 1).toString());
            });
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
