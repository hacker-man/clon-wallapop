/**
 * @api {post} api/login/ Allows to register a new user
 * @apiName PostUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiPermission none
 *
 * @apiDescription Check if the user data is in the db and if the password is correct. When everything is OK an access token is provided.
 *
 * @apiParam {String} email Users email
 * @apiParam {String} pass Users password
 *
 * @apiSuccess (200)  {String} token token
 * @apiSuccess (200) {String} status succesfull code
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 * {
 * "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NzM0MzIxNDE1YmNhZGU4MWEyYzdkMzEiLCJyb2wiOiJhZG1pbiIsImVtYWlsIjoibGF1dGFyby56dW5pZ2FAYmFiZWwuZXMiLCJuYW1lIjoiTGF1dGFybyBHZXJtw6FuIFrDusOxaWdhIiwiaWF0IjoxNDYzMDQyMTI5LCJleHAiOjE0NjQyNTE3Mjl9.uOFIQ7JkET16KrU36FnqLJC5cPUI7DOVEakeiLhAr4Y",
 * "name": "Lautaro Germán Zúñiga",
 * "photo": "../images/profile-images/5734321415bcade81a2c7d31B para cuentas.png",
 * "id": "5734321415bcade81a2c7d31"
 *  }
 *
 * @apiError {String} result specific error
 * @apiError {String} status Error Code
 *
 * @apiErrorExample {json} Error-Response
 *  HTTP/1.1 401 Unauthorized
 *   {
 *     result: "pass or email invalid",y
 *      status: "Unauthorized"
 *   }
 */

/**
 * @api {get} api/users/ Returns all the existing users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission none
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
 * {
 *   "_id": "5734321415bcade81a2c7d33",
 *   "name": "Hector Moreno Cervera",
 *   "rol": "user",
 *    "pass": "jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=",
 *   "email": "hector.moreno@babel.es",
 *   "date": "2016-04-26T00:00:00.000Z",
 *   "__v": 0,
 *   "favCat": []
 * },
 * {
 *   "_id": "5734321415bcade81a2c7d32",
 *   "name": "Jose Luis Romero Lluch",
 *   "rol": "user",
 *   "pass": "jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=",
 *   "email": "joseluis.romero@babel.es",
 *  "date": "2016-04-26T00:00:00.000Z",
 *   "__v": 0,
 *  "favCat": []
 * }]
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *      "result": "Internal error while looking for the user",
 *      "status": "Internal Server Error"
 *      }
 */

/**
 * @api {get} api/users/:id Returns the specific user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
 *   "_id": "5734321415bcade81a2c7d31",
 *   "name": "Lautaro Germán Zúñiga",
 *  "rol": "admin",
 *  "pass": "FeKw08M4keuw8e9gnsQZQgwg4yDOlMZfvIwzEkSOsiU=",
 *  "email": "lautaro.zuniga@babel.es",
 *  "date": "2016-04-26T00:00:00.000Z",
 *  "__v": 0,
 *   "photoSocial": "../images/profile-images/5734321415bcade81a2c7d31B para cuentas.png",
 *    "favCat": []
 *}
 *
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *      "result": "That user does not exists",
 *      "status": "Internal Server Error"
 *      }
 */


/**
  * @api {get} api/sale/:id returns all ads for sale for a specific user
  * @apiName GetSaleUser
  * @apiVersion 1.0.0
  * @apiGroup Users
  *
  * @apiParam {Number} id Users unique ID.
  *
  *
  * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [
  {
    "_id": "573ec9cfbef1015838eeba94",
    "title": "asdasdasd",
    "detail": "asdasdasd",
    "price": 34435,
    "badge": "EUR",
    "category": "CAT1",
    "exchanges": false,
    "negotiable": false,
    "shipments": false,
    "owner": "Lautaro Germán Zúñiga",
    "image": "../images/ads-images/15.jpeg",
    "sold": false,
    "booked": false,
    "visits": 0,
    "likes": 0,
    "purchaser": "",
    "creationDate": "2016-05-20T08:24:47.242Z",
    "__v": 0,
    "tags": []
   }]
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *      "result": "That user does not exists",
 *      "status": "Internal Server Error"
 *      }
 * 
*/


/**
 * @api {get} api/location/:id returns geographic location for a specic user
 * @apiName GetLocation
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
     longitude: null,
     latitude: null,
     LivingArea: Madrid,España 
   }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
     longitude: 110,
     latitude: 115,
     LivingArea: null 
   }
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *      "result": "That user does not exists",
 *      "status": "Internal Server Error"
 *      }
 */

/**
 * @api {post} api/signUp/ Register a new user
 * @apiName SignUp
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {String} name Users name
 * @apiParam {String} email Users email
 * @apiParam {String} pass Users password
 *
 * @apiSuccess (200) {String} token token
 * @apiSuccess (200) {String} name user name
 * @apiSuccess (200) {String} id user id
 *
 * @apiSuccessExample {json} response example:
 *   {  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NzM0MmUzY2U2YTJkNmUwMjA5OWQ4ZDQiLCJlbWFpbCI6ImVtYWlsQGVtZHNmc2RmYWlsLmVzIiwibmFtZSI6Ikl2w6Fuc2Rmc2QiLCJpYXQiOjE0NjMwMzc1MDAsImV4cCI6MTQ2NDI0NzEwMH0.0dsG2WAFCc0xw7Za67bhYDpaaW_FJ2EInZEsTT04NPI",
 *       "name": "Ivan",
 *       "id": "57342e3ce6a2d6e02099d8d4"
 *   }
 *
 *@apiError {String} result specific error
 *@apiError {String} status Error Code
 *@apiErrorExample {json} Error-Response:
    HTTP/1.1 500 Internal Server Error
    {
       result: "Mongo Internal Error",
       status: "Internal Server Error"
    }
 *@apiErrorExample {json} Error-Response:
    HTTP/1.1 403 Forbidden, user already exists
    {
       result: "user already exists",
       status: "Forbidden, user already exists"
    }
*/

/**
 * @api {post} api/auth/facebook/ Allows to login with facebook
 * @apiName PostFacebook
 * @apiVersion 1.0.0
 * @apiGroup Facebook
 * @apiParam {String} code Code for Facebook authorization for access token
 * @apiParam {String} client_id Client ID for Facebook authorization for access token
 * @apiParam {String} client_secret Client secret key for Facebook authorization for access token
 * @apiParam {String} redirect_uri URI redirect for Facebook authorization for access token
 *
 * @apiSuccess {String} token token
 *
 * @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NzIzMjEwMzA1NWQ2NjZjMTY3ODUyNjUiLCJyb2wiOiJ1c2VyIiwiZW1haWwiOiJyb2Npby5yb21lcm9AYmFiZWwuZXMiLCJuYW1lIjoiUm9jw61vIFJvbWVybyBQYW5lcm8iLCJpYXQiOjE0NjE5MjAwNzMsImV4cCI6MTQ2MzEyOTY3M30.kuEozMp2Pdi3Cfn2cEAdIuA7zSps1KRKVZgOzLivRAo",
        name: "Jose Luis",
        photo: "https://graph.facebook.com/v2.3/109249799482221/picture?type=large"
    }
 * @apiError {String} message specific error

 * @apiErrorExample {json} Error-Response
    HTTP/1.1 409 Conflict
    {
       message: "There is already a Facebook account that belongs to you"
    }
 * @apiErrorExample {json} Error-Response
    HTTP/1.1 400 Bad Request
    {
       message: "User not found"
    }
    @apiSampleRequest off
*/

/**
 * @api {post} api/auth/google/ Allows to login with Google +
 * @apiName PostGoogle
 * @apiVersion 1.0.0
 * @apiGroup Google
 * @apiParam {String} code Code for Google authorization for access token
 * @apiParam {String} client_id Client ID for Google authorization for access token
 * @apiParam {String} client_secret Client secret key for Google authorization for access token
 * @apiParam {String} redirect_uri URI redirect for Google authorization for access token
 * @apiParam {String} grant_type Type grant for Google authorization for access token
 *
 * @apiSuccess {String} token token
 *
 * @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NzIzMjEwMzA1NWQ2NjZjMTY3ODUyNjUiLCJyb2wiOiJ1c2VyIiwiZW1haWwiOiJyb2Npby5yb21lcm9AYmFiZWwuZXMiLCJuYW1lIjoiUm9jw61vIFJvbWVybyBQYW5lcm8iLCJpYXQiOjE0NjE5MjAwNzMsImV4cCI6MTQ2MzEyOTY3M30.kuEozMp2Pdi3Cfn2cEAdIuA7zSps1KRKVZgOzLivRAo",
        name: "Jose Luis",
        photo: https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=200"
    }
 * @apiError {String} message specific error
 * @apiErrorExample {json} Error-Response
    HTTP/1.1 409 Conflict
    {
       message: "There is already a Google account that belongs to you"
    }
 * @apiErrorExample {json} Error-Response
    HTTP/1.1 400 Bad Request
    {
       message: "User not found"
    }
    @apiSampleRequest off
*/

/**
 * @api {put} api/location/:id Allows to modify user geographic location
 * @apiName PutLocation
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {String} livingArea 
 * @apiParam {Number} latitude
 * @apiParam {Number} longitude
 *
 * @apiSuccess (200) {String} modified Number of modified elements.
 * @apiSuccess (200) {String} status Successfull Code.
 *
 * @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
         "modified": 1,
 *       "status": "OK"
 *      }
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 * @apiErrorExample Error-Response:

      HTTP/1.1 500 Internal server error
       {
        "result": "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
        "status": "Internal server error"
       }
 * @apiErrorExample Error-Response:
 * HTTP/1.1 406 Not Acceptable
 * {
      result: "You must send latitude and longitude or livingArea",
      status: "Not Acceptable"
   }
 * @apiSampleRequest off
*/

/**
 * @api {put} api/infoUser/:id Allows to modify the information of an user
 * @apiVersion 1.0.0
 * @apiName PutInfoUser
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 * @apiParam {String} name Users name.
 * @apiParam {Number} phone Users phone number
 * @apiParam {String} gender Users gender
 * @apiParam {String} livingArea Users living area.
 * @apiParam {Date} birthDate Users birth date.
 *
 * @apiSuccess {String} modified Number of modified elements.
 * @apiSuccess {String} status Successfull Code.
 *
 * @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
        "modified": 1,
        "status": "OK"
        }

 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 * @apiErrorExample Error-Response:

      HTTP/1.1 500 Internal server error
       {
        "result": "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
        "status": "Internal server error"
       }
 *   @apiErrorExample Error-Response:
      HTTP/1.1 406 Not Acceptable
      {
        "result": "You can't modify user _id, date of creation or rol",
        "status": "Not Acceptable"
      }
      @apiSampleRequest off
 */

/**
* @api {put} api/email/:id Allows to modify user email
* @apiVersion 1.0.0
* @apiName PutEmailUser
* @apiGroup Users
*
* @apiParam {Number} id Users unique ID.
* @apiParam {String} email Users email.
*
* @apiSuccess {String} modified Number of modified elements.
* @apiSuccess {String} status Successfull Code.
* @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
       {
       "modified": 1,
       "status": "OK"
       }

* @apiError {String} result Specific Error.
* @apiError {String} status Error Code.

* @apiErrorExample Error-Response:
* HTTP/1.1 406 Not Acceptable
*{
   result: "You can't modify user _id, date of creation or rol or password",
   status: "Not Acceptable"
 }
 * @apiErrorExample Error-Response:
 * HTTP/1.1 406 Not Acceptable
 *{
     result: "User with this email already exists",
     status: "Not Acceptable"
   }
 * @apiErrorExample Error-Response:
     HTTP/1.1 500 Internal server error
     {
         result: err.message,
         status: "Internal server error",
 *   }
 @apiSampleRequest off
*/

/**
 * @api {put} api/categories/:id Allows to modify user email
 * @apiVersion 1.0.0
 * @apiName PutCategoriesUser
 * @apiGroup Users
 * @apiSuccess {String} modified Number of modified elements.
 * @apiSuccess {String} status Successfull Code.
 * @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
        "modified": 1,
        "status": "OK"
        }

 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 * @apiErrorExample Error-Response:
 * HTTP/1.1 406 Not Acceptable
 * {
      result: "You must send favCat in body",
      status: "Not Acceptable"
    }
 *
 *  @apiErrorExample Error-Response:
      HTTP/1.1 500 Internal server error
      {
          result: err.message,
          status: "Internal server error",
  *   }
  @apiSampleRequest off
*/

/**
* @api {put} api/pass/:id Allows to modify user pass
* @apiVersion 1.0.0
* @apiName PutPassUser
* @apiGroup Users
*
*
* @apiParam {Number} id Users unique ID.
* @apiParam {String} email Users email.
*
* @apiError {String} result Specific Error.
* @apiError {String} status Error Code.
*
* @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
       {
       "modified": 1,
       "status": "OK"
       }
 * @apiErrorExample Error-Response:
     HTTP/1.1 500 Internal server error
     {
         result: err.message,
         status: "Internal server error",
 *   }
 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 406 Not Acceptable
    {
       result: "The previous password doesn't matches the bbdd password",
       status: "Not Acceptable"
    }  
    @apiSampleRequest off
*/
/**
 * @api {put} api/photo/:id Allows to modify user photo social
 * @apiVersion 1.0.0
 * @apiName PutPhotoUser
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 * @apiParam {File} file contains image file.
 *
 * @apiSuccess {String} modified Number of modified elements.
 * @apiSuccess {String} status Successfull Code.
 *
 *
 * @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
        "modified": 1,
        "status": "OK"
        }
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.

   * @apiErrorExample Error-Response:
      HTTP/1.1 500 Internal server error
      {
          result: err.message,
          status: "Internal server error",
     }
  
   * @apiErrorExample Error-Response:
      HTTP/1.1 406 Not Acceptable
      {
          result: "You must send a file in the request",
          status: "Not Acceptable"
  *   }
  *
  @apiSampleRequest off
 */

/**
* @api {post} api/createAd/ Allows to create and Ad
* @apiVersion 1.0.0
* @apiName PostAd
* @apiGroup Ads
*
* @apiParam {String} title ad title.
* @apiParam {String} detail Bried ad description.
* @apiParam {String} owner ad owner.
* @apiParam {Number} price ad price.
* @apiParam {String} badge $,€,£.
* @apiParam {String} category ad unique category.
* @apiParam {String} tags Ads tags.
* @apiParam {Boolean} exchanges It allows products exchanges.
* @apiParam {Boolean} negotiable   negotiable price.  
* @apiParam {Boolean} shipments It allows products shipments.
* @apiParam {File} file contains image file
*
* @apiSuccess {String} ad created ad.
* @apiSuccess {String} status Successfull Code.
*
* @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
       {
       "ad": {
        "__v": 0,
        "title": "PlayStation4",
        "detail": "Seminueva,con 2 mandos",
        "owner": "Jose",
        "price": 2222,
        "badge": "eur",
        "category": "Video Consolas",
        "exchanges": true,
        "negotiable": true,
        "shipments": false,
        "image": "./public/images/ads-images/Hydrangeas.jpg",
        "sold": false,
        "booked": false,
        "visits": 0,
        "likes": 0,
        "purchaser": "",
        "creationDate": "2016-05-11T10:49:59.149Z",
        "_id": "57330e57acfe1c54172f8039",
        "tags": []
      },
      "status": "OK"
      }
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 *
 * @apiErrorExample Error-Response:
    HTTP/1.1 400 Bad Request
    {
      status: "Bad Request, all form fields are mandatory"
    }
 *
 *@apiErrorExample Error-Response:
  HTTP/1.1 500 Internal Server Error
   {
        "result": "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
        "status": "Internal server error"
   }
  *@apiErrorExample Error-Response:
    HTTP/1.1 415 Unsupported media type
    {
      status: "Unsupported media type"
    }
  @apiSampleRequest off
*/

/**
 * @api {get} api/getAds/ Returns all ads
 * @apiVersion 1.0.0
 * @apiName GetAds
 * @apiGroup Ads
 *
 *
* @apiSuccessExample Success-Response:
  HTTP/1.1 200 OK
  [
  {
    "_id": "57330d33e8cda9201f1faa08",
    "detail": "PlayStation 4 seminueva, con caja, mandos y 2 juegos",
    "creationDate": "2016-04-25T00:00:00.000Z",
    "owner": "Jose",
    "price": 390,
    "badge": "eur",
    "category": "Consolas y Videojuegos",
    "exchanges": false,
    "negotiable": false,
    "shipments": true,
    "sold": false,
    "booked": false,
    "visits": 0,
    "likes": 0,
    "purchaser": "",
    "__v": 0,
    "tags": [
      "consolas",
      "playStation",
      "videojuegos"
    ]
  },
  {
    "_id": "57330d33e8cda9201f1faa09",
    "detail": "Iphone 4 seminuevo, con caja y cargador ",
    "creationDate": "2016-04-25T00:00:00.000Z",
    "owner": "Hector",
    "price": 360,
    "badge": "usd",
    "category": "Electrónica",
    "exchanges": true,
    "negotiable": false,
    "shipments": true,
    "sold": false,
    "booked": false,
    "visits": 0,
    "likes": 0,
    "purchaser": "",
    "__v": 0,
    "tags": [
      "iphone4",
      "móvil",
      "electrónica"
    ]
  }
]
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
  * @apiErrorExample Error-Response:
    HTTP/1.1 400 Bad Request
    {
      result: err,
      status: "Bad Request, all form fields are mandatory"
    }
 */

/**
* @api {get} api/ads/:id Returns the specific ad
* @apiVersion 1.0.0
* @apiName GetAd
* @apiGroup Ads
*
* @apiParam {Number} id Users unique ID.
*
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
* 
{
       "_id": "5734321415bcade81a2c7d34",
       "detail": "PlayStation 4 seminueva, con caja, mandos y 2 juegos",
       "creationDate": "2016-04-25T00:00:00.000Z",
       "owner": "Jose",
       "price": 390,
       "badge": "eur",
       "category": "Consolas y Videojuegos",
       "exchanges": false,
       "negotiable": false,
       "shipments": true,
       "sold": false,
       "booked": false,
       "visits": 0,
       "likes": 0,
       "purchaser": "",
       "__v": 0,
       "tags": [
           "consolas",
           "playStation",
           "videojuegos"
       ]
   }
*
*
* @apiError {String} result Specific Error.
* @apiError {String} status Error Code.
*
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 500 Internal server error
*     {
*      "result": "That user does not exists",
*      "status": "Internal Server Error"
*      }
*/


/**
 * @api {put} api/editAd Allows to modify ad data
 * @apiName PutAd
 * @apiVersion 1.0.0
 * @apiGroup Ads
 *
 * @apiParam {String} title ad title.
 * @apiParam {String} detail Bried ad description.
 * @apiParam {String} owner ad owner.
 * @apiParam {Number} price ad price.
 * @apiParam {String} badge $,€,£.
 * @apiParam {String} category ad unique category.
 * @apiParam {String} tags Ads tags.
 * @apiParam {Boolean} exchanges It allows products exchanges.
 * @apiParam {Boolean} negotiable   negotiable price.  
 * @apiParam {Boolean} shipments It allows products shipments.
 * @apiParam {File} file contains image file
 *
 * @apiSuccess (200) {String} ad edited ad.
 * @apiSuccess (200) {String} status Successfull Code.
 * @apiSuccess (200) {String} data Updated data.
 *
 * @apiSuccessExample Success-Response:
       HTTP/1.1 200 OK
         {
          "ad": {
             "__v": 0,
             "title": "PlayStation4",
             "detail": "Seminueva,con 2 mandos",
             "owner": "Jose",
             "price": 2222,
             "badge": "eur",
             "category": "Video Consolas",
             "exchanges": true,
             "negotiable": true,
             "shipments": false,
             "image": "./public/images/ads-images/Hydrangeas.jpg",
             "sold": false,
             "booked": false,
             "visits": 0,
             "likes": 0,
             "purchaser": "",
             "creationDate": "2016-05-11T10:49:59.149Z",
             "_id": "57330e57acfe1c54172f8039",
             "tags": []
         },
 *         "status": "OK",
 *         "data": {
 *           "ok": 1,
 *           "nModified": 1,
 *           "n": 1
 *          }
 *       }
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 * @apiError {String} translation Error message.
 
 * @apiErrorExample Error - Response:
    HTTP / 1.1 500 Internal Server Error {
        "result": "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
        "status": "Internal server error"
    } 
 * @apiErrorExample Error - Response:
    HTTP / 1.1 415 Unsupported media type {
        status: "Unsupported media type"
    }
  * @apiErrorExample Error - Response:
     HTTP / 1.1 409 Conflict {
         result: "There are no users with such name",
         status: "Conflict",
          translation: "The purchaser is not valid. Are you sure that is how you spell it?"
      }
   * @apiErrorExample Error - Response:
      HTTP / 1.1 409 Conflict
      {
          result: "You cannot sell an ad to yourself",
          status: "Forbidden",
          translation: "You cannot buy your own products",
          users: [
  {
    "_id": "574e8d8a98dcce144a222322",
    "name": "Donald Duck",
    "email": "donald@gmail.com",
    "pass": "idjBZjMes41Zs0dqSNJmyyQ52VSo5twnX0+KbcBqI6g=",
    "date": "2016-06-01T07:23:54.617Z",
    "__v": 0,
    "photoSocial": "../images/profile-images/574e8d8a98dcce144a222322.png",
    "latitude": 42.55308028895583,
    "longitude": -96.6796875,
    "livingArea": "",
    "favAds": [
      "574e8fb198dcce144a222329",
      "574e8b6798dcce144a22231c"
    ],
    "reviews": [],
    "sold": [],
    "sale": [
      "574e8e3498dcce144a222324"
    ],
    "favCat": []
  },
  {
    "_id": "574e8e4f98dcce144a222325",
    "name": "Lautaro Germán Zúñiga Garrido",
    "rol": "user",
    "email": "maiden_lzg@msn.com",
    "photoSocial": "https://graph.facebook.com/v2.3/862037273905315/picture?type=large",
    "facebook": "862037273905315",
    "__v": 0,
    "favAds": [
      "574e8fb198dcce144a222329",
      "574e8ce098dcce144a222321"
    ],
    "reviews": [],
    "sold": [],
    "sale": [
      "574e8ebd98dcce144a222327",
      "574e8fb198dcce144a222329",
      "574e900398dcce144a22232b"
    ],
    "favCat": []
  }
          ]
    }
  * @apiErrorExample Error - Response:
      HTTP / 1.1 409 Conflict
      {
          result: "You cannot sell an ad to yourself",
          status: "Forbidden",
          translation: "You cannot buy your own products",
      }

      @apiSampleRequest off
*/




/**
 * @api {put} api/editFavs Allows to edit User favorites
 * @apiName PutFavs
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {String} id User id.
 * @apiParam {String} ad_id Ad id.
 *
 * @apiSuccess (200) {String} status Successfull Code.
 * @apiSuccess (200) {String} data Updated data.
 *
 * @apiSuccessExample Success-Response:
       HTTP/1.1 200 OK
         {
 *         "status": "OK",
 *         "data": {
 *           "ok": 1,
 *           "nModified": 1,
 *           "n": 1
 *          }
 *       }
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 
 * @apiErrorExample Error - Response:
    HTTP / 1.1 500 Internal Server Error {
        "result": "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
        "status": "Internal server error"
    } 
*/


/**
 * @api {put} api/deleteAd Allows to delete an ad
 * @apiName DeleteAd
 * @apiVersion 1.0.0
 * @apiGroup Ads
 *
 * @apiParam {String} user User id.
 * @apiParam {String} ad Ad id.
 *
 * @apiSuccess (200) {String} status Successfull Code.
 * @apiSuccess (200) {String} data Updated data.
 *
 * @apiSuccessExample Success-Response:
 *        HTTP/1.1 200 OK
 * {
 *   "status": "OK",
 *   "data": {
 *     "_id": "5746a6e7e6fd4c0c0b7c58c4",
 *     "title": "Titulo",
 *     "detail": "detalles",
 *     "price": 123,
 *     "badge": "EUR",
 *     "category": "CAT4",
 *     "exchanges": true,
 *     "negotiable": false,
 *     "shipments": false,
 *     "owner": "Jorollu a",
 *     "image": "../images/ads-images/64.png",
 *     "sold": false,
 *     "visits": 0,
 *     "likes": 0,
 *     "purchaser": "",
 *     "creationDate": "2016-05-26T07:33:59.052Z",
 *     "__v": 0,
 *     "tags": []
 *   }
 * }
 *
 * @apiError {String} result Specific Error.
 * @apiError {String} status Error Code.
 *
 
 * @apiErrorExample Error - Response:
    HTTP / 1.1 500 Internal Server Error {
        "result": "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
        "status": "Internal server error"
    } 
*/

/**
  * @api {post} api/forgotten sends a new password to your mail
  * @apiName PostForgotten
  * @apiVersion 1.0.0
  * @apiGroup Users
  *
  * @apiParam {String} email Users email
  *
  *
  * @apiSuccess (200)  {String} status Successfull Code.
  * @apiSuccess (200) {String} data update data response
  *
  * @apiSuccessExample {json} Success-Response:
  *   HTTP/1.1 200 OK
  *  { 
  *    status: "OK", data: data 
  *  }
  *
  * @apiError {String} result Specific Error.
  * @apiError {String} status Error Code.
  *
 
  * @apiErrorExample Error - Response:
  *  {
  *      result: "Cast to ObjectId failed for value \"571f56394c5f89540d1525debn\" at path \"_id\",
  *      status: "Internal server error",
  *  }

*/
/**
  * @api {post}
  * @apiName 
*/

