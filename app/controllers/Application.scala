package controllers

import models.db.{UserEmails, UserTokens, Users}
import play.api.libs.json.{JsArray, JsObject, Json}
import play.api.mvc._

import scala.concurrent.Future

object Application extends Controller {

	def main(title: String) = Action {
		implicit request =>
			Ok(views.html.index(title))
	}

	/**
	 * All Discussions
	 */
	def index = main("All Discussions")

	/**
	 * Topic View
	 */
	def showTopic(slug: String) = main(slug)

	/**
	 * Create New Topic
	 */
	def createTopic = main("Create Topic")

	/**
	 * View User's Profile
	 */
	def viewProfile(username: String) = main(username + "'s Profile")

	/**
	 * Edit Your Profile
	 */
	def editProfile = main("Edit Your Profile")


	def debug = Action.async {
		Users.list.flatMap({ users =>
			Future.sequence(users.map({ u =>
				for {
					t <- UserTokens.list(u)
					e <- UserEmails.list(u)
				} yield {
					Json.toJson(u).as[JsObject] +
						("tokens" -> Json.toJson(t)) +
						("emails" -> Json.toJson(e))
				}
			})).map(JsArray).map(Ok(_))
		})
	}

	def useragent = Action {
		request =>
			Ok(io.rampant.vulgar.utils.UserAgent.makeString(request.headers.get("User-Agent").get))
	}

}
