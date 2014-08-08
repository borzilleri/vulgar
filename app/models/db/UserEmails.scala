package models.db

import io.rampant.vulgar.db.Pools
import models.{User, UserEmail}
import play.api.db.slick.Config.driver.simple._

import scala.concurrent.Future

class UserEmails(tag: Tag) extends Table[UserEmail](tag, "USER_EMAILS") {
	def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

	def userId = column[Long]("user_id", O.NotNull)

	def email = column[String]("email", O.NotNull)

	def confirmed = column[Boolean]("confirmed", O.Default(false))

	def * = (id.?, userId, email, confirmed) <>((UserEmail.apply _).tupled, UserEmail.unapply)

	// Ensure unique emails
	def idx_unique_email = index("idx_unique_email ", email, unique = true)
}

object UserEmails {
	val query = TableQuery[UserEmails]

	def list(user: User): Future[Seq[UserEmail]] = user.id match {
		case Some(uid) => list(uid)
		case None => Future.successful(Seq())
	}

	def list(uid: Long): Future[Seq[UserEmail]] = Pools.readPool execute { implicit s =>
		query.filter(_.userId === uid).list
	}

	def findByEmail(email: String, allowUnconfirmed: Boolean = false) = Pools.readPool execute { implicit s =>
		(for {
			ue <- query if ue.email === email && (ue.confirmed || !allowUnconfirmed)
		} yield ue).firstOption
	}

	def insert(value: UserEmail) = Pools.writePool execute { implicit s =>
		value.copy(id = Some((query returning query.map(_.id)) += value))
	}


}
