package io.rampant.vulgar.db

import play.api.db.slick.Session

case class Job[U](fn: Session => U)
