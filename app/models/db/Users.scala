package models.db

import io.rampant.vulgar.db.Pools
import models.User
import play.api.db.slick.Config.driver.simple._

import scala.concurrent.Future

class Users(tag: Tag) extends Table[User](tag, "USERS") {
	def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

	def displayName = column[String]("display_name", O.NotNull)

	def * = (id.?, displayName) <>((User.apply _).tupled, User.unapply)
}

object Users {
	val query = TableQuery[Users]

	def list: Future[Seq[User]] = Pools.readPool execute { implicit s => query.list}

	def find(userId: Long): Future[Option[User]] = Pools.readPool execute { implicit s =>
		query.filter(_.id === userId).firstOption
	}

	def insert(user: User) = Pools.writePool execute { implicit s =>
		user.copy(id = Some((query returning query.map(_.id)) += user))
	}

}
