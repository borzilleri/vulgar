package io.rampant.vulgar.mail.mailers

import io.rampant.vulgar.mail.{Mailer, Message}
import play.Logger
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.ws.{WS, WSAuthScheme}

import scala.concurrent.Future


object Mailgun extends Mailer {
	val LOGGER = Logger.of(Mailgun.getClass)
	lazy val baseUrl = current.configuration.getString("mailgun.api.url").get
	lazy val apiKey = current.configuration.getString("mailgun.api.key").getOrElse("")
	lazy val domain = current.configuration.getString("mailgun.domain").getOrElse("")

	private def logApiError(status: Int, requestBody: String) {
		val m = status match {
			case 400 => "Bad Request"
			case 401 => "Invalid API Key"
			case _ => "Internal mailgun Error"
		}
		LOGGER.error("Error sending mail: {}\n{}", m, requestBody)
	}

	override def send(to: String, msg: Message): Future[Boolean] = {
		val form = Map(
			"from" -> Seq(from),
			"to" -> Seq(to),
			"subject" -> Seq(msg.subject),
			"html" -> Seq(msg.htmlBody),
			"text" -> Seq(msg.textBody)
		)
		val url = s"$baseUrl/$domain/messages"
		LOGGER.debug("Mailgun url: {}", url)
		WS.url(url).withAuth("api", apiKey, WSAuthScheme.BASIC).post(form).map({ r =>
			r.status match {
				case 200 => true
				case _: Int =>
					logApiError(r.status, r.body)
					false
			}
		}).recover({ case e: Throwable =>
			LOGGER.error("Exception sending mail.", e)
			false
		})
	}
}
