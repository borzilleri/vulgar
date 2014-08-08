package models.db

import java.time.Instant

import models.Post
import play.api.db.slick.Config.driver.simple._

class Posts(tag: Tag) extends Table[Post](tag, "POSTS") {

	def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

	def postId = column[Long]("post_id")

	def userId = column[Long]("user_id")

	def source = column[String]("source")

	def html = column[String]("source")

	def createdOn = column[Instant]("created_on")

	def modifiedOn = column[Instant]("modified_on")

	def modifiedBy = column[Long]("modified_by")

	def * = (id.?, postId, userId, source, html, createdOn, modifiedBy, modifiedOn) <>(Post.tupled, Post.unapply)
}
