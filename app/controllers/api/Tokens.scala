package controllers.api

import io.rampant.vulgar.mail.AuthTokenMessage
import io.rampant.vulgar.mail.Mailer._
import io.rampant.vulgar.security.{AuthTokenManager, Secured}
import models.db.{UserEmails, UserTokens}
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DBAction
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import scala.concurrent.Future

object Tokens extends Controller {

	case class Login(email: String, persist: Boolean)

	val loginForm = Form(mapping(
		"email" -> email,
		"persist" -> boolean
	)(Login.apply)(Login.unapply))

	def list = (Secured.Authenticated andThen Secured.Authorized()).async {
		implicit request =>
			UserTokens.list(request.user.get).map(Json.toJson(_)).map(Ok(_))
	}

	def create = Action.async(parse.urlFormEncoded) {
		implicit request =>
			val form = loginForm.bindFromRequest()
			form.fold(
				errors => Future.successful(BadRequest("Invalid email address")),
				model => UserEmails.findByEmail(model.email).flatMap({
					case None => Future.successful(Ok)
					case Some(u) =>
						val token = AuthTokenManager.generate(u.userId, persist = model.persist)
						AuthTokenManager.save(token)
						mailer.send(model.email, new AuthTokenMessage(token.token)).map({
							case true => Ok
							case false => InternalServerError
						})
				})
			)
	}

	def delete(tokenId: Long) = DBAction {
		implicit rs =>
			implicit val s = rs.dbSession
			UserTokens.delete(tokenId)
			Ok
	}
}
