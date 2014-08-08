package models

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

import play.api.Play.current
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class UserToken(id: Option[Long], userId: Long, token: String,
                     createdOn: Instant, sessionOnly: Boolean,
                     browser: String, name: Option[String]) extends UserOwned(userId) {

	def timeout = sessionOnly match {
		case true => UserToken.sessionCookieTimeout
		case false => UserToken.persistCookieTimeout
	}

	def expiresOn = createdOn.plus(timeout, ChronoUnit.HOURS)

	def expired = expiresOn.isBefore(java.time.Instant.now())
}

object UserToken {
	lazy val sessionCookieTimeout = current.configuration.getInt("auth.cookie.session.timeout").get
	lazy val persistCookieTimeout = current.configuration.getInt("auth.cookie.persist.timeout").get

	implicit val instantWrites: Writes[Instant] = (
		(JsPath \ "timestamp").write[Long] and
			(JsPath \ "display").write[String]
		)({ i => (i.toEpochMilli, i.toString)})

	implicit val userWrites: Writes[UserToken] = (
		(JsPath \ "id").write[Option[Long]] and
			(JsPath \ "userId").write[Long] and
			(JsPath \ "createdOn").write[Instant] and
			(JsPath \ "expiresOn").write[Instant] and
			(JsPath \ "browser").write[String] and
			(JsPath \ "name").write[Option[String]]
		)(t => (t.id, t.userId, t.createdOn, t.expiresOn, t.browser, t.name))

	def makeToken = UUID.randomUUID.toString
}
