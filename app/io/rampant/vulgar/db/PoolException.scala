package io.rampant.vulgar.db

case class PoolException(msg: String, t: Throwable) extends Exception(msg, t)
