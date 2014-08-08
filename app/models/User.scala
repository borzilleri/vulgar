package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class User(id: Option[Long], displayName: String)
object User {
  implicit val userWrites: Writes[User] = (
    (JsPath \ "id").write[Option[Long]] and
      (JsPath \ "displayName").write[String]
    )(unlift(User.unapply))
}
