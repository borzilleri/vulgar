package io.rampant.vulgar.db

import play.api.Play.current
import play.api.libs.concurrent.Akka

object Pools {
	implicit val system = Akka.system

	val writePool = new WorkerPool("slick-write-pool")

	val readPool = new WorkerPool("slick-read-pool")

}
