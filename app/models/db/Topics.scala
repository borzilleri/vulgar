package models.db

import models.Topic
import play.api.db.slick.Config.driver.simple._

class Topics(tag: Tag) extends Table[Topic](tag, "TOPICS") {
	def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

	def title = column[String]("title")

	def slug = column[String]("slug")

	def * = (id.?, title, slug) <>(Topic.tupled, Topic.unapply)
}

object Topics {
	val query = TableQuery[Topics]
}
