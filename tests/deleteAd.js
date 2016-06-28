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

        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });



    //TESTID:deleteAd1
    it('elimina anuncio del listado en venta', function() {
        browser.getCurrentUrl().then(function(actualUrl) {
            //Borramos anuncio
            element(by.id('toggleSale')).click();
            browser.sleep(1000);
            element.all(by.repeater('item in saleData')).count().then(function(count) {
                element(by.id('deleteAdBtn_0')).click();
                browser.sleep(1000);
                //Comprobamos que el contador de elementos ha decrecido
                browser.switchTo().alert().accept();
                //Ruta final esperada
                browser.driver.navigate().to('http://localhost:3000/#/ads');
                browser.driver.navigate().to(actualUrl);
                element.all(by.repeater('item in saleData')).count().then(function(count2) {
                    //Ruta final esperada
                    expect(count2).toBe(count - 1);
                });
            });
        });
    });


    //TESTID:deleteAd2
    it('elimina anuncio del listado favoritos', function() {
        //Primero ponemos el anuncio a favorito
        browser.getCurrentUrl().then(function(actualUrl) {
            //Borramos anuncio
            element(by.id('toggleSale')).click();
            browser.sleep(1000);
            element(by.id('img_0')).click();
            //Damos like al anuncio
            browser.driver.navigate().to('http://localhost:3000/#/ads');
            element(by.id('heartOff_0')).click();
            expect(element(by.binding('item.likes')).getText()).toEqual('1');
            browser.driver.navigate().to(actualUrl);

            element(by.id('toggleSale')).click();
            browser.sleep(1000);
            element.all(by.repeater('item in favAdsData')).count().then(function(count) {
                browser.sleep(1000);
                //Borramos anuncio
                element(by.id('deleteAdBtn_0')).click();
                
                browser.switchTo().alert().accept();
                browser.driver.navigate().to('http://localhost:3000/#/ads');
                //Volvemos al perfil
                browser.driver.navigate().to(actualUrl);
                element.all(by.repeater('item in favAdsData')).count().then(function(count2) {
                    //Comprobamos que el contador de favoritos ha decrecido
                    expect(count2).toBe(count - 1);
                });
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
