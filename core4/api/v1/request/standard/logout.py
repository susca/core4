from core4.api.v1.request.main import CoreRequestHandler


class LogoutHandler(CoreRequestHandler):
    title = "logout"
    author = "mra"

    async def get(self):
        """
        Same as :meth:`.post`
        """
        await self.post()

    async def post(self):
        """
        Logout an authenticated user.

        Parameters:
            None

        Returns:
            dict with data element as str ``OK``

        Errors:
            401: Unauthorized

        Examples:
            >>> from requests import get, post
            >>> url = "http://localhost:5001/core4/api/v1/login"
            >>> signin = get(url + "?username=admin&password=hans")
            >>> h = {"Authorization": "Bearer " + signin.json()["data"]["token"]}
            >>> signin.status_code
            200
            >>> rv = get("http://localhost:5001/core4/api/v1/logout", headers=h)
            >>> rv
            {
                '_id': '5bd9b796de8b692fd5f5f768',
                'code': 200,
                'data': 'OK',
                'message': 'OK',
                'timestamp': '2018-10-31T14:09:26.114443'
            }
        """
        self.current_user = None
        self.set_secure_cookie("token", "")
        self.reply("OK")
