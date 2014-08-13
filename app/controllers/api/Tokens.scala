package controllers.api

import io.rampant.vulgar.mail.AuthTokenMessage
import io.rampant.vulgar.mail.Mailer._
import io.rampant.vulgar.security.{AuthTokenManager, Secured}
import models.db.{UserEmails, UserTokens}
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import scala.concurrent.Future

object Tokens extends Controller {

	case class Login(email: String, persist: Boolean)

	case class Rename(name: String)

	val loginForm = Form(mapping(
		"email" -> email,
		"persist" -> boolean
	)(Login.apply)(Login.unapply))

	val renameForm = Form(mapping(
		"name" -> text
	)(Rename.apply)(Rename.unapply))

	def list = (Secured.Authenticated andThen Secured.Authorized()).async {
		implicit request =>
			UserTokens.list(request.user.get).map(Json.toJson(_)).map(Ok(_))
	}

	def rename(id: Long) = (Secured.Authenticated andThen Secured.Authorized()).async(parse.json) {
		implicit request =>
			renameForm.bindFromRequest().fold(
				errors => Future.successful(BadRequest("Invalid name")),
				model => UserTokens.find(id).flatMap({
					case None => Future.successful(NotFound)
					case Some(token) => UserTokens.update(token.copy(name = Some(model.name))).map({ t =>
						Ok(Json.toJson(t));
					})
				})
			)
	}

	def create = Action.async(parse.json) {
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

	def delete(tokenId: Long) = (Secured.Authenticated andThen Secured.Authorized()).async {
		request =>
			UserTokens.find(tokenId).map({
				case None => NotFound
				case Some(t) =>
					if (t.userId != request.user.get.id.get) Forbidden
					else {
						UserTokens.delete(tokenId)
						Ok
					}
			})
	}
}
