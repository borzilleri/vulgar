package controllers.api

import io.rampant.vulgar.security.Secured
import models.db.UserEmails
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

object Emails extends Controller {

	def list = (Secured.Authenticated andThen Secured.Authorized()).async {
		implicit request =>
			UserEmails.list(request.user.get).map(Json.toJson(_)).map(Ok(_))
	}

	def delete(id: Long) = Action {
		Ok
	}

}
