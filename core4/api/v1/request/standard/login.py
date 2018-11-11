import core4.queue.helper
import core4.util
from core4.api.v1.request.main import CoreRequestHandler
from core4.api.v1.role.main import Role
from tornado.web import HTTPError

class LoginHandler(CoreRequestHandler):
    title = "login and password reset"
    author = "mra"
    protected = False

    async def get(self):
        """
        Same as :meth:`.post`
        """
        await self.post()

    async def post(self):
        """
        Login using *Basic Auth* header, *Bearer Auth* header, token parameter,
        token cookie or username/password parameter.

        Parameters:
            username (str): requesting login
            password (str): requesting login

        Returns:
            data element with

            - **token** (*str*): the created authorization token

        Raises:
            401: Unauthorized

        Examples:
            >>> from requests import get, post
            >>> url = "http://localhost:5001/core4/api/v1/login"
            >>> rv = get(url + "?username=admin&password=hans")
            >>> rv.json()
            {
                '_id': '5bd94d9bde8b6939aa31ad88',
                'code': 200,
                'data': {
                    'token': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...'
                },
                'message': 'OK',
                'timestamp': '2018-10-31T06:37:15.734609'
            }
            >>> rv.headers
            {
                'Access-Control-Allow-Headers': 'access-control-allow-origin,authorization,content-type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Origin': '*',
                'Content-Length': '339',
                'Content-Type': 'application/json; charset=UTF-8',
                'Date': 'Wed, 31 Oct 2018 06:37:15 GMT',
                'Etag': '"d62ecba1141f2653ebd4d9a54f677701e3f6337f"',
                'Server': 'TornadoServer/5.1.1',
                'Set-Cookie': 'token="2|1:0|10:1540967835|5:token|280:ZXlK..."; '
                'expires=Fri, 30 Nov 2018 06:37:15 GMT; Path=/',
                'Token': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjo...'
            }
            >>> signin = post(url, json={"username": "admin", "password": "hans"})
            >>> post(url, cookies=signin.cookies)
            <Response [200]>
            >>> h = {"Authorization": "Bearer " + signin.json()["data"]["token"]}
            >>> post(url, headers=h)
            <Response [200]>
            >>> get("http://localhost:5001/core4/api/v1/profile", headers=h)
            <Response [200]>
        """
        user = await self.verify_user()
        if user:
            token = self.create_token(user.name)
            self.current_user = user.name
            user.login()
            return self.reply({
                "token": token
            })
        self.set_header('WWW-Authenticate', 'Basic realm=Restricted')
        self.set_status(401)
        if self.wants_json():
            self.write_error(401)

    async def put(self):
        """
        User password reset.

        Parameters:
            email (str): of the user who requests to reset his password
            token (str): of the authenticated user
            password (str): the new password to set

        ``PUT`` with an existing ``email`` parameter starts the password  reset
        workflow and sends a password reset token by email. ``PUT`` with this
        ``token`` and a new ``password`` updates the user's password and
        finishes the password reset workflow.

        .. note:: The email with the reset password token is sent with a
                  seperate job. Check core4 logging or ``sys.queue`` regarding
                  the email and token (see :ref:`tools`)

        Returns:
            dict with empty data element

        Raises:
            None

        Examples:
            >>> url = "http://localhost:5001/core4/api/v1/login"
            >>> put(url + "?email=mail@mailer.com").json()
            {
                '_id': '5bd9a525de8b691c2c0754d8',
                'code': 200,
                'data': None,
                'message': 'OK',
                'timestamp': '2018-10-31T12:50:45.919375'
            }
            >>> # check logging for reset token if email not sent
            >>> token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJuYW..."
            >>> put(url + "?password=hans&token=" + token).json()
            {
                '_id': '5bd9a619de8b691c2ca2d0d0',
                'code': 200,
                'data': 'OK',
                'message': 'OK',
                'timestamp': '2018-10-31T12:54:50.106412'
            }
        """
        email = self.get_argument("email", default=None)
        token = self.get_argument("token", default=None)
        password = self.get_argument("password", default=None)
        if email:
            await self._start_password_reset(email)
        elif token and password:
            await self._finish_password_reset(token, password)
        else:
            raise HTTPError(400)

    async def _start_password_reset(self, email):
        # internal method to create and send the password reset token
        self.logger.debug("enter password reset for [%s]", email)
        try:
            user = Role().load_one(email=email)
        except:
            self.logger.warning("email [%s] not found", email)
        else:
            username = user.name
            self.current_user = username
            secs = self.config.api.reset_password.expiration
            payload = {
                'email': email,
                'name': username,
            }
            token = self.create_jwt(secs, payload)
            self._send_mail(email, user.realname, token)
            self.logger.info("send token [%s] to user [%s] at [%s]",
                             token, username, email)
        self.reply(None)

    async def _finish_password_reset(self, token, password):
        # internal method to set the updated password
        payload = self.parse_token(token)
        try:
            user = Role().load_one(name=payload["name"])
        except:
            self.logger.warning("user [%s] not found", payload["name"])
        user.password = password
        user.save()
        self.logger.debug(
            "finish password reset for user [%s]", payload["name"])
        self.reply("OK")

    def _send_mail(self, email, realname, token):
        # internal method to send the password reset token
        core4.queue.helper.enqueue(
            core4.queue.helper.MailerJob,
            template="",
            recipients=email,
            subject="core4: your password reset request",
            realname=realname,
            token=token
        )

    # async def load_user(self, username):
    #     doc = await self.motor.core4test.sys.role.find_one({'name': username})
    #     doc["password_hash"] = doc["password"]
    #     del doc["password"]
    #     return Role(**doc)