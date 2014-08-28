package controllers

import io.rampant.vulgar.security.{AuthRequest, Secured}
import play.api.libs.json.Json
import play.api.mvc._

object Application extends Controller {
	val unauthorizedResult = Redirect(routes.Application.index())

	def main(title: String) = {
		implicit request: AuthRequest[AnyContent] =>
			Ok(views.html.index(title, request.user.map(Json.toJson(_).toString())))
	}

	/**
	 * All Discussions
	 */
	def index = Secured.Authenticated(main("All Discussions"))

	/**
	 * Topic View
	 */
	def showTopic(slug: String) = (Secured.Authenticated andThen Secured.Authorized(result = unauthorizedResult))(
		main(slug)
	)

	/**
	 * Create New Topic
	 */
	def createTopic = (Secured.Authenticated andThen Secured.Authorized(result = unauthorizedResult))(
		main("Create Topic")
	)

	/**
	 * View User's Profile
	 */
	def viewProfile(username: String) = (Secured.Authenticated andThen Secured.Authorized(result = unauthorizedResult))(
		main(s"$username's Profile")
	)

	/**
	 * Edit Your Profile
	 */
	def editProfile = (Secured.Authenticated andThen Secured.Authorized(result = unauthorizedResult))(
		main("Edit Your Profile")
	)
}
