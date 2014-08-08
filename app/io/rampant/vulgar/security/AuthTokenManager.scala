package io.rampant.vulgar.security

import java.util.UUID

import play.api.Play.current
import play.api.cache.Cache

/**
 * TODO: Maybe put this code in an actor?
 */
object AuthTokenManager {
	val tokenCookieName = current.configuration.getString("auth.cookie.name").get
	val tokenCountTimeout = current.configuration.getInt("auth.token.throttle.timeout").getOrElse(60 * 10)
	val tokenCountMax = current.configuration.getInt("auth.token.throttle.max").getOrElse(5)
	val tokenTimeout = current.configuration.getInt("auth.token.timeout").getOrElse(60 * 15)
	val tokenCachePrefix = "authToken_"
	val emailTokenCountPrefix = "emailCount_"

	case class AuthToken(token: String, userId: Long, persist: Boolean)

	private def tokenCacheKey(token: String) = "authToken_" + token

	def generate(userId: Long, persist: Boolean): AuthToken = {
		AuthToken(UUID.randomUUID.toString, userId, persist)
	}

	def save(authToken: AuthToken) = {
		val count = Cache.getOrElse[Int](emailTokenCountPrefix + authToken.userId)(0)
		if (count <= tokenCountMax) {
			Cache.set(tokenCacheKey(authToken.token), authToken, tokenTimeout)
			Cache.set(emailTokenCountPrefix + authToken.userId, count + 1)
		}
	}

	def find(token: String): Option[AuthToken] = Cache.getAs[AuthToken](tokenCacheKey(token))

	def resolve(token: String) = Cache.remove(tokenCacheKey(token))

}
