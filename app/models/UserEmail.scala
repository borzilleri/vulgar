package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class UserEmail(id: Option[Long], userId: Long, email: String, confirmed: Boolean) extends UserOwned(userId)

object UserEmail {
  implicit val userEmailWrites: Writes[UserEmail] = (
    (JsPath \ "id").write[Option[Long]] and
      (JsPath \ "userId").write[Long] and
      (JsPath \ "email").write[String] and
      (JsPath \ "confirmed").write[Boolean]
    )(unlift(UserEmail.unapply))
}
