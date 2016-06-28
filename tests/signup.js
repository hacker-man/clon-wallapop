describe('Protractor BabelPop App', function() {
    var nombre = element(by.model('model.name'));
    var email = element(by.model('model.email'));
    var clave = element(by.model('model.password'));
    var registerBtn = element(by.id('regBtn'));
    var errReg = element(by.id('alreadyreg'));

    beforeEach(function() {
        browser.get('http://localhost:3000/#/signup');
    });



    it('btn registro deshabilitado si nombre y email vacíos', function() {
        nombre.sendKeys('');
        email.sendKeys('');
        clave.sendKeys('johndoe12345');
        expect(registerBtn.isEnabled()).toBe(false);
    });

    it('btn registro deshabilitado si pass menor 8 caracteres', function() {
        nombre.sendKeys('John Doe');
        email.sendKeys('johndoe@anonymus.us');
        clave.sendKeys('1234567');
        expect(registerBtn.isEnabled()).toBe(false);
    });
    //Si falta el nombre
    it('btn registro deshabilitado si nombre vacío', function() {
        nombre.sendKeys('');
        email.sendKeys('johndoe@anonymus.us');
        clave.sendKeys('johndoe12345');
        expect(registerBtn.isEnabled()).toBe(false);
    });
    //Si falta el email
    it('btn registro deshabilitado si email vacío', function() {
        nombre.sendKeys('John Doe');
        email.sendKeys('');
        clave.sendKeys('johndoe12345');
        expect(registerBtn.isEnabled()).toBe(false);
    });

    //Si ya esta registrado
    it('Bloqueo registro si el email ya esta en uso', function() {
        nombre.sendKeys('John Wayne');
        email.sendKeys('lautaro.zuniga@babel.es');
        clave.sendKeys('123456789');
        expect(registerBtn.isEnabled()).toBe(true);
        registerBtn.click();
        expect(errReg.getText()).toEqual('>>> Email ya en uso <<<');
    });
    //Nombre de usuario en blanco
    it('btn registro deshabilitado si nombre espacios blanco', function() {
        nombre.sendKeys('          ');
        email.sendKeys('lautaro.zuniga@babel.es');
        clave.sendKeys('123456789');
        expect(registerBtn.isEnabled()).toBe(false);
    });


    //Si me registro correctamente
    it('Registro satisfactorio', function() {
        nombre.sendKeys('John Doe');
        email.sendKeys('johndoe@email.com');
        clave.sendKeys('johndoe12345');
        expect(registerBtn.isEnabled()).toBe(true);
        registerBtn.click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');

        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });

});
