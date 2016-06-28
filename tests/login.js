describe('Protractor BabelPop App', function() {

    var email = element(by.model('model.email'));
    var clave = element(by.model('model.password'));
    var enterBtn = element(by.id('entrarBtn'));
    var errMessage = element(by.id('errMsg'));

    beforeEach(function() {
        browser.get('http://localhost:3000/#/login');
    });

    //Si introduzco un usuario que no existe
    it('should not let me continue when user does not exist', function() {
        email.sendKeys('noooOAexiste@2366sa6x423noExiste.us');
        clave.sendKeys('fakepass123');
        expect(enterBtn.isEnabled()).toBe(true);
        enterBtn.click();
        expect(errMessage.getText()).toEqual('>>> Usuario o contraseña incorrectos <<<');
    });
    //Si falta  email
    it('Campo email vacío', function() {
        email.sendKeys('');
        clave.sendKeys('johndoe12345');
        expect(enterBtn.isEnabled()).toBe(false);
    });
    //Si falta contraseña
    it('Campo password vacío', function() {
        email.sendKeys('johndoe@anonymus.us');
        clave.sendKeys('');
        expect(enterBtn.isEnabled()).toBe(false);
    });
  
    it('la contraseña debe tener al menos 8 caracteres', function() {

        email.sendKeys('johndoe@anonymus.us');
        clave.sendKeys('1234567');
        expect(enterBtn.isEnabled()).toBe(false);
    });

    
    it('Logueo y logout satisfacorios', function() {
        email.sendKeys('lautaro.zuniga@babel.es');
        clave.sendKeys('123456789');
        expect(enterBtn.isEnabled()).toBe(true);
        enterBtn.click(); 
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile');
        browser.sleep(2000);
        browser.driver.navigate().to("http://localhost:3000/#/logout");
        var exit = element(by.id("exit"));
        exit.click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');

    });

});
