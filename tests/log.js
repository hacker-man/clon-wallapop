describe('Protractor BabelPop App', function() {

    var btnEntrar = element(by.id('loginBabel'));
    var btnReg = element(by.id('regBabel'));
    var btnFb = element(by.id('loginFB'));
    var btnGoo = element(by.id('loginGoo'));


    beforeEach(function() {
        browser.get('http://localhost:3000/#/log');
    });

    
    it('should be redirect to login page', function() {
        btnEntrar.click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/login');
        browser.driver.navigate().to("http://localhost:3000/#/login");
    });

    it('should be redirect to signup page', function() {
        btnReg.click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/signup');
        browser.driver.navigate().to("http://localhost:3000/#/login");
    });

 
    it('should be login succesfully with facebook and logout', function() {
        btnFb.click();
        browser.sleep(2000);
        browser.driver.getAllWindowHandles().then(function(handles) {
            var popUp = handles[1];
            var principal = handles[0];
            browser.switchTo().window(popUp); 
            var email = browser.driver.findElement(by.id('email'));
            var pass = browser.driver.findElement(by.id('pass'));
            var btnEntrar = browser.driver.findElement(by.id('u_0_2'));
            email.sendKeys('joseluis.romero@babel.es');  
            pass.sendKeys('babelpop'); 
            btnEntrar.click();
            browser.sleep(1000);
            browser.switchTo().window(principal); 
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
            browser.driver.navigate().to("http://localhost:3000/#/logout");
            browser.sleep(1000);
            var exit = element(by.id("exit"));
            exit.click();
            browser.sleep(1000);
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
            browser.driver.navigate().to("http://localhost:3000/#/login");
            browser.sleep(1000);
        });
    });

     

     it('should be login succesfully with google and logout', function() {
        btnGoo.click();
        browser.sleep(2000);
        browser.driver.getAllWindowHandles().then(function(handles) {
            var popUp = handles[1];
            var principal = handles[0];
            browser.switchTo().window(popUp); 
            var email = browser.driver.findElement(by.id('Email'));
            email.sendKeys('babelpopteam@gmail.com'); 
            var next = browser.driver.findElement(by.id('next'));
            next.click();
            browser.sleep(2000);
            var pass = browser.driver.findElement(by.id('Passwd'));
            pass.sendKeys('babelpop');
            var btnSingIn = browser.driver.findElement(by.id('signIn'));   
            btnSingIn.click();
            browser.sleep(3000);
            var btnAllow = browser.driver.findElement(by.id('submit_approve_access'));
            btnAllow.click();
            browser.sleep(2000);
            browser.switchTo().window(principal); 
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
            browser.driver.navigate().to("http://localhost:3000/#/logout");
            browser.sleep(1000);
            var exit = element(by.id("exit"));
            exit.click();
            browser.sleep(2000);
            expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
        });
    });


});
