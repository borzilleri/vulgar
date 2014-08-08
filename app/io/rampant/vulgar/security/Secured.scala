package io.rampant.vulgar.security

import models.db.{UserTokens, Users}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.Future

object Secured {

	val Authenticated = new ActionBuilder[AuthRequest] with ActionTransformer[Request, AuthRequest] {
		def transform[A](request: Request[A]) = {
			(request.cookies.get(AuthTokenManager.tokenCookieName) match {
				case None => Future.successful(None)
				case Some(c) => UserTokens.find(c.value)
			}).flatMap({
				case None => Future.successful(None)
				case Some(t) => Users.find(t.userId)
			}).map(AuthRequest(_, request))
		}
	}

	def Authorized(roles: Seq[String] = Seq()) = new ActionFilter[AuthRequest] {
		override protected def filter[A](request: AuthRequest[A]): Future[Option[Result]] = request.user match {
			case None => Future.successful(Some(Unauthorized))
			case Some(user) =>
				// TODO: For now, any authenticated user is "Authorized"
				Future.successful(None)
		}
	}

}
