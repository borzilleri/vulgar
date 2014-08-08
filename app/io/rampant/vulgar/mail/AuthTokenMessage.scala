package io.rampant.vulgar.mail

import controllers.routes
import io.rampant.vulgar.security.AuthTokenManager
import play.api.Play.current
import play.api.mvc._

class AuthTokenMessage(token: String)(implicit r: Request[Any]) extends Message {
  val appName = current.configuration.getString("application.name").get

  def loginUrl = routes.Authentication.redeemToken(token).absoluteURL(r.secure)

  override def subject: String = current.configuration
    .getString("mail.authToken.subject").get

  override def htmlBody: String = views.html.mail
    .authTokenHtml(appName, loginUrl, AuthTokenManager.tokenTimeout / 60).body

  override def textBody: String = views.html.mail
    .authTokenText(appName, loginUrl, AuthTokenManager.tokenCountTimeout / 60).body
}
