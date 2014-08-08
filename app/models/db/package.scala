package models

import java.sql.Timestamp
import java.time.Instant

import play.api.db.slick.Config.driver.simple._

package object db {
	implicit val InstantColumnType = MappedColumnType.base[Instant, Timestamp](
	{ i => Timestamp.from(i)}, { t => t.toInstant}
	)


}
