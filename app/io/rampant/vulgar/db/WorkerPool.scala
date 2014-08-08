package io.rampant.vulgar.db

import akka.actor.{ActorSystem, Props}
import akka.pattern.ask
import akka.routing.FromConfig
import akka.util.Timeout
import play.api.db.slick.Session

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.{Failure, Success}

case class WorkerPool[T](poolName: String)(implicit system: ActorSystem) {
	val defaultTimeout = 20.seconds
	private val workerProps = Props(classOf[Worker[T]])
	private val router = system.actorOf(FromConfig.props(workerProps), name = poolName)

	import system.dispatcher

	def execute[U](fn: Session => U)(implicit timeout: Timeout = defaultTimeout): Future[U] =
		ask(router, Job[U](fn)).map {
			case Success(res: U) => res
			case Failure(t) => throw PoolException("Database pool execution error.", t)
		}
}
