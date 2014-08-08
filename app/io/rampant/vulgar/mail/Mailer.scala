package io.rampant.vulgar.mail

import io.rampant.vulgar.mail.mailers.Mailgun
import play.api.Play.current

import scala.concurrent.Future

trait Mailer {
	val from = current.configuration.getString("mail.fromAddress").getOrElse("vulgarbbs_admin_change_me@example.com")

	def send(to: String, msg: Message): Future[Boolean]

}

object Mailer {
	val defaultMailer = Mailgun
	lazy val mailer = mailerByName(current.configuration.getString("mail.mailer").getOrElse(""))

	protected def mailerByName: String => Mailer = Map(
		"mailgun" -> Mailgun
	).getOrElse(_, defaultMailer)
}
