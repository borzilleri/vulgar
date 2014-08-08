import io.rampant.vulgar.security.JsonFilter
import models.db.{UserEmails, Users}
import models.{User, UserEmail}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.WithFilters
import play.api.{Application, GlobalSettings, Logger}
import play.filters.gzip.GzipFilter

object Global extends WithFilters(new GzipFilter(), JsonFilter) with GlobalSettings {
	override def onStart(app: Application): Unit = {
		super.onStart(app)

		UserEmails.findByEmail("jonathan@borzilleri.net").map({
			case None => Users.insert(User(None, "Jonathan")).flatMap({ u =>
				Logger.debug(u.toString)
				UserEmails.insert(UserEmail(None, u.id.get, "jonathan@borzilleri.net", confirmed = true)).map({ e =>
					Logger.debug(e.toString)
				})
			})
			case Some(_) => // Do nothing
		})
	}
}
