package io.rampant.vulgar.security

import java.io.ByteArrayInputStream

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import play.api.libs.json.Json
import play.api.mvc.{Filter, RequestHeader, Result}

import scala.concurrent.Future

object JsonFilter extends Filter {
	override def apply(next: (RequestHeader) => Future[Result])(rh: RequestHeader): Future[Result] = {
		next(rh).flatMap { result =>
			if (result.header.headers.getOrElse("Content-Type", "").startsWith("application/json")) {
				val bytesToString: Enumeratee[Array[Byte], String] = Enumeratee.map[Array[Byte]] { bytes => new String(bytes)}
				val resultBody: Future[String] = result.body |>>> bytesToString &>> Iteratee.consume[String]()

				resultBody.map { body =>
					val wrappedBody = Json.obj(
						"payload" -> Json.parse(body)
					).toString()

					val enumeratedBody: Enumerator[Array[Byte]] = {
						Enumerator.fromStream(new ByteArrayInputStream(wrappedBody.getBytes))
					}
					result.copy(body = enumeratedBody)
				}
			}
			else {
				Future.successful(result)
			}
		}
	}
}
