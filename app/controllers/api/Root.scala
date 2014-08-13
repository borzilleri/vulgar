package controllers.api

import io.rampant.vulgar.security.{AuthTokenManager, Secured}
import models.db.UserTokens
import play.api.libs.json.{JsObject, Json}
import play.api.mvc.Controller

object Root extends Controller {
	def whoami = (Secured.Authenticated andThen Secured.Authorized()).async {
		implicit r =>
			UserTokens.findByToken(r.cookies.get(AuthTokenManager.tokenCookieName).get.value).map({
				t =>
					Ok(Json.toJson(r.user.get).as[JsObject] + ("tokenId" -> Json.toJson(t.get.id)))
			})
	}
}
