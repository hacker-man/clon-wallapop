describe('Protractor BabelPop App', function() {

    var emailLogin = element(by.model('model.email'));
    var passwordLogin = element(by.model('model.password'));
    var path = require('path');


    beforeEach(function() {
        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        browser.get('http://localhost:3000/#/login');
        browser.sleep(2000);
        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("tests@tests.com");
        element(by.model('model.password')).sendKeys("testspass");
        element(by.id('entrarBtn')).click();

        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        browser.sleep(2000);
        element(by.id('editProfileBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');
    });



    //TESTID:manPutUser1
    it('modifica datos basicos usuario', function() {
        element(by.model('userData.name')).clear().sendKeys("TestsEditado");
        element(by.model('userData.surname')).clear().sendKeys("ApellidosEditados");
        element(by.model('userData.phone')).clear().sendKeys("666555444");
        element(by.id('acceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });

    //TESTID:manPutUser3
    it('modifica la foto de perfil del usuario', function() {

        element(by.id('changePictureBtn')).click();
        var fileToUpload = 'Testing_in_Progress.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);

        $('input[type="file"]').sendKeys(absolutePath);

        element(by.id('#uploadButton')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });


    //TESTID:manPutUser4
    it('modifica la contraseña del usuario', function() {


        element(by.id('togglePass')).click();
        element(by.model('oldPass')).clear().sendKeys("testspass");
        element(by.model('newPass')).clear().sendKeys("testspass2");
        element(by.model('confirmPass')).clear().sendKeys("testspass2");
        element(by.id('passChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');

        //Realizamos logout y probamos con la nueva contraseña
        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        element(by.id('logoutID')).click();
        element(by.id('exit')).click();
        browser.sleep(2000);
        browser.get('http://localhost:3000/#/login');

        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("tests@tests.com");
        element(by.model('model.password')).sendKeys("testspass2");
        element(by.id('entrarBtn')).click();


        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');

        element(by.id('editProfileBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');


        //Volvemos a dejar la contraseña como al principio
        element(by.id('togglePass')).click();

        element(by.model('oldPass')).clear().sendKeys("testspass2");
        element(by.model('newPass')).clear().sendKeys("testspass");
        element(by.model('confirmPass')).clear().sendKeys("testspass");

        element(by.id('passChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });

    //TESTID:manPutUser5
    it('modifica el email del usuario', function() {

        element(by.id('toggleEmail')).click();

        element(by.model('userData.email')).clear().sendKeys("test@test.com");

        element(by.id('emailChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');

        //Realizamos logout y probamos con la nueva contraseña
        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        element(by.id('logoutID')).click();
        element(by.id('exit')).click();
        browser.sleep(2000);
        browser.get('http://localhost:3000/#/login');
        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("test@test.com");
        element(by.model('model.password')).sendKeys("testspass");
        element(by.id('entrarBtn')).click();

        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');

        element(by.id('editProfileBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');


        //Volvemos a dejar el email como al principio
        element(by.id('toggleEmail')).click();

        element(by.model('userData.email')).clear().sendKeys("tests@tests.com");

        element(by.id('emailChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });

    //TESTID:manPutUser7
    it('no modifica la password del usuario', function() {

        element(by.id('togglePass')).click();
        element(by.model('oldPass')).clear().sendKeys("WRONG");
        element(by.model('newPass')).clear().sendKeys("testspass2");
        element(by.model('confirmPass')).clear().sendKeys("testspass2");
        element(by.id('passChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');

    });

    //TESTID:manPutUser8
    it('no modifica la password del usuario', function() {

        element(by.id('togglePass')).click();
        element(by.model('oldPass')).clear().sendKeys("testpass");
        element(by.model('newPass')).clear().sendKeys("testspass2");
        element(by.model('confirmPass')).clear().sendKeys("WRONG");
        element(by.id('passChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');
    });



    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');
        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });
});
