package io.rampant.vulgar.mail

trait Message {

	def subject: String

	def htmlBody: String

	def textBody: String

}
