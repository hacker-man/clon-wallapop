    describe('Protractor BabelPop App', function() {

        var btnBusqueda = element(by.id('toggleAdv'));
        var inputBusqueda = element(by.id('buscador'));
        var btnBusqueda = element(by.id('btnBusqueda'));
        var barraBusqueda = element(by.id('toggleAdv'));
        var btnFiltro = element(by.id('btnLg"'));
        var width = 1920;
        var height = 1080;
        browser.driver.manage().window().setSize(width, height);

        beforeAll(function() {
            browser.get('http://localhost:3000/#/login');
            element(by.model('model.email')).sendKeys("tester@babel.es");
            element(by.model('model.password')).sendKeys("123456789");
            element(by.id('entrarBtn')).click();
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
        });

        beforeEach(function() {
            browser.get('http://localhost:3000/#/ads');
        });


        it('comprueba que filtra bien por nombre', function() {
            inputBusqueda.sendKeys("TestFilt1");
            btnBusqueda.click().then(
                function() {
                    element(by.id('eye_0')).click();
                    expect(element(by.id('adTitle')).getText()).toEqual("TestFilt1");
                },
                function(err) {}
            );

        });

        it('comprueba que filtra bien por descripcion', function() {
            inputBusqueda.sendKeys("TestFilt2");
            btnBusqueda.click().then(
                function() {
                    element(by.id('eye_0')).click();
                    expect(element(by.id('adDescription')).getText()).toEqual("TestFilt2");
                },
                function(err) {}
            );
        });


        it('comprueba que el precio minimo es menor o igual que que el maximo', function() {
            barraBusqueda.click().then(
                function() {
                    browser.sleep(2000);
                    element(by.id('minID')).sendKeys('-1');
                    expect(element(by.id('warningmin1')).getText()).toEqual("El precio debe ser mayor o igual que 0");
                    element(by.id('minID')).clear().sendKeys(2);
                    element(by.id('maxID')).clear().sendKeys(1);
                    expect(element(by.id('warningmin2')).getText()).toEqual("El precio debe ser mayor que el precio mínimo");
                },
                function(err) {}
            );
        });

        it('comprueba que el precio se filtra correctamente', function() {
            barraBusqueda.click().then(
                function() {
                    browser.sleep(2000);
                    element(by.id('minID')).clear().sendKeys(5);
                    element(by.id('maxID')).clear().sendKeys(10);
                    btnFiltro.click().then(
                        function(){
                            browser.sleep(5000);
                            expect(element.all(by.repeater('item in model')).count()).toEqual(2);
                            expect(element(by.id('price_0')).getText()).toEqual("5");
                            expect(element(by.id('price_1')).getText()).toEqual("10");
                        },
                        function(err){}
                    );
                },
                function(err) {}
            );
        });


        afterAll(function() {
            element(by.id('logoutID')).click();
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

            element(by.id('exit')).click();
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
        });

    });
