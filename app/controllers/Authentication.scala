package controllers

import io.rampant.vulgar.security.AuthTokenManager
import io.rampant.vulgar.utils.UserAgent
import models.UserToken
import models.db.UserTokens
import play.api.mvc.{Action, Controller, Cookie, DiscardingCookie}

import scala.concurrent.Future

object Authentication extends Controller {
	def logout = Action {
		implicit request =>
			request.cookies.get(AuthTokenManager.tokenCookieName) match {
				case Some(c) => UserTokens.deleteByToken(c.value)
				case _ => ;
			}
			Redirect(routes.Application.index())
				.discardingCookies(DiscardingCookie(AuthTokenManager.tokenCookieName))
	}

	def redeemToken(authToken: String) = Action.async {
		implicit request =>
			AuthTokenManager.find(authToken) match {
				case None => Future.successful(Unauthorized("Invalid Auth Token"))
				case Some(token) =>
					val cookieVal = UserToken.makeToken
					val browser = UserAgent.makeString(request.headers.get("User-Agent").getOrElse(""))
					UserTokens.insert(UserToken(None, token.userId, cookieVal, java.time.Instant.now(), token.persist, browser, None))
						.map({ t =>
						val maxAge = if (t.sessionOnly) Some(t.expiresOn.getEpochSecond.toInt) else None
						Redirect(routes.Application.index()).withCookies(
							Cookie(AuthTokenManager.tokenCookieName, cookieVal, maxAge, httpOnly = true)
						)
					})
			}
	}
}
