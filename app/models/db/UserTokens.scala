package models.db

import java.time.Instant

import io.rampant.vulgar.db.Pools
import models.{User, UserToken}
import play.api.db.slick.Config.driver.simple._

import scala.concurrent.Future

class UserTokens(tag: Tag) extends Table[UserToken](tag, "USER_TOKENS") {
	def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

	def userId = column[Long]("user_id", O.NotNull)

	def token = column[String]("token", O.NotNull)

	def createdOn = column[Instant]("expiration", O.NotNull)

	def sessionOnly = column[Boolean]("session_only", O.NotNull, O.Default(false))

	def browser = column[String]("browser", O.NotNull, O.Default("unknown"))

	def alias = column[String]("alias", O.Nullable)

	def * = (id.?, userId, token, createdOn, sessionOnly, browser, alias.?) <>((UserToken.apply _).tupled, UserToken.unapply)
}

object UserTokens {
	val query = TableQuery[UserTokens]

	def list(user: User): Future[Seq[UserToken]] = user.id match {
		case Some(uid) => list(uid)
		case None => Future.successful(Seq())
	}

	def list(uid: Long): Future[Seq[UserToken]] = Pools.readPool execute { implicit s =>
		query.filter(_.userId === uid).list
	}

	def find(id: Long): Future[Option[UserToken]] = Pools.readPool execute { implicit s =>
		query.filter(_.id === id).firstOption
	}

	def findByToken(token: String): Future[Option[UserToken]] = Pools.readPool execute { implicit s =>
		query.filter(_.token === token).firstOption
	}

	def insert(value: UserToken) = Pools.writePool execute { implicit s =>
		value.copy(id = Some((query returning query.map(_.id)) += value))
	}

	def deleteByToken(token: String) = Pools.writePool execute { implicit s =>
		query.filter(_.token === token).delete
	}

	def delete(tokenId: Long) = Pools.writePool execute { implicit s =>
		query.filter(_.id === tokenId).delete
	}

	def update(token: UserToken) = Pools.writePool execute { implicit s =>
		query.update(token)
		token
	}
}
