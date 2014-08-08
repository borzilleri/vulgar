package models

import java.time.Instant

case class Post(id: Option[Long], topicId: Long, userId: Long, source: String, html: String,
                createdOn: Instant, modifiedBy: Long, modifiedOn: Instant) extends UserOwned(userId){

}
