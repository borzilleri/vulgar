package io.rampant.vulgar.utils

import net.sf.uadetector.service.UADetectorServiceFactory
import play.api.Play.current
import play.api.cache.Cache

object UserAgent {
	val parser = UADetectorServiceFactory.getCachingAndUpdatingParser
	val uaCachePrefix = "userAgent_"
	val uaCacheTimeout = 60 * 60 * 24

	def parseFromString(ua: String) = Cache.getOrElse(uaCachePrefix + ua, uaCacheTimeout)(parser.parse(ua))

	def makeString(ua: String) = {
		val b = parseFromString(ua)
		s"${b.getName} (${b.getVersionNumber.toVersionString}) / ${b.getOperatingSystem.getFamilyName} (${b.getOperatingSystem.getVersionNumber.toVersionString})"
	}
}
