module.exports = {
    login: function(email, password) {
        //En la base de datos debe existir un usuario con email tests@tests.com y password testspass
        browser.get('http://localhost:3000/#/login');

        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys(email);
        element(by.model('model.password')).sendKeys(password);
        element(by.id('entrarBtn')).click();
    },

    
    logout: function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    }
};
