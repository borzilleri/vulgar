package io.rampant.vulgar.db

import akka.actor.Actor
import play.api.Play.current
import play.api.db.slick.{DB, Session}

import scala.util.Try

class Worker[T] extends Actor {
	override def receive = {
		case Job(fn: (Session => T)) =>
			DB withSession {
				implicit s =>
					sender ! Try(fn(s))
			}
	}
}
