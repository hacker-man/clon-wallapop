describe('Protractor BabelPop App', function() {
    var nombre = element(by.model('model.name'));
    var email = element(by.model('model.email'));
    var clave = element(by.model('model.password'));
    var registerBtn = element(by.id('regBtn'));

    beforeEach(function() {
        browser.get('http://localhost:3000/#/signup');
        
    });


    //Si me registro correctamente
    it('Registro satisfactorio 1', function() {
        nombre.sendKeys('Tests');
        email.sendKeys('tests@tests.com');
        clave.sendKeys('testspass');
        expect(registerBtn.isEnabled()).toBe(true);
        registerBtn.click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
    });

    //Si me registro correctamente
    it('Registro satisfactorio 2', function() {
        nombre.sendKeys('Lautaro');
        email.sendKeys('lautaro.zuniga@babel.es');
        clave.sendKeys('123456789');
        expect(registerBtn.isEnabled()).toBe(true);
        registerBtn.click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
    });

  it('Registro satisfactorio 3', function() {
        nombre.sendKeys('TesteadorFiltros');
        email.sendKeys('tester@babel.es');
        clave.sendKeys('123456789');
        expect(registerBtn.isEnabled()).toBe(true);
        registerBtn.click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
    });


    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });

});
