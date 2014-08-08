package controllers.api

import io.rampant.vulgar.security.Secured
import play.api.libs.json.Json
import play.api.mvc.Controller

object Root extends Controller {
	def whoami = (Secured.Authenticated andThen Secured.Authorized()) {
		implicit r =>
			Ok(Json.toJson(r.user.get))
	}

}
